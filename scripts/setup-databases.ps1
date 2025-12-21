# Script para criar e inicializar todas as bases de dados do NutriGPT
# Este script configura os bancos de dados necessários para os backends (chat e money-mate)
# Pode usar Docker ou PostgreSQL local

param(
    [string]$PostgresHost = "localhost",
    [string]$PostgresUser = "postgres",
    [string]$PostgresPort = "5432",
    [string]$PostgresPassword = "postgres",
    [switch]$UseDocker = $false,
    [switch]$StartDocker = $false,
    [string]$DockerComposePath = "."
)

Write-Host "================================" -ForegroundColor Cyan
Write-Host "NutriGPT - Database Setup Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Função para verificar e iniciar Docker
function Start-PostgresDocker {
    param([string]$DockerPath)
    
    Write-Host "Verificando Docker..." -ForegroundColor Yellow
    
    # Verificar se Docker está instalado
    try {
        $dockerVersion = docker --version
        Write-Host "✓ Docker encontrado: $dockerVersion" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Docker não encontrado. Instale Docker Desktop." -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "Iniciando PostgreSQL com Docker..." -ForegroundColor Yellow
    
    # Carregar variáveis de ambiente do .env.docker se existir
    $envFilePath = Join-Path $DockerPath ".env.docker"
    if (Test-Path $envFilePath) {
        Write-Host "Carregando variáveis de $envFilePath" -ForegroundColor Cyan
        foreach ($line in Get-Content $envFilePath) {
            if ($line -match "^\s*#" -or [string]::IsNullOrWhiteSpace($line)) { continue }
            if ($line -match "^([^=]+)=(.*)$") {
                $key = $matches[1].Trim()
                $value = $matches[2].Trim()
                [Environment]::SetEnvironmentVariable($key, $value, "Process")
            }
        }
    }
    
    # Iniciar docker-compose
    $dockerComposeFile = Join-Path $DockerPath "docker-compose.db.yml"
    if (-not (Test-Path $dockerComposeFile)) {
        Write-Host "✗ Arquivo docker-compose.db.yml não encontrado em $DockerPath" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Iniciando containers com docker-compose..." -ForegroundColor Cyan
    Push-Location $DockerPath
    
    docker-compose -f docker-compose.db.yml up -d
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Erro ao iniciar Docker" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    
    Write-Host "✓ Container PostgreSQL iniciado" -ForegroundColor Green
    
    # Aguardar que o PostgreSQL esteja pronto
    Write-Host "Aguardando PostgreSQL estar pronto..." -ForegroundColor Yellow
    $attempts = 0
    $maxAttempts = 30
    
    while ($attempts -lt $maxAttempts) {
        try {
            $env:PGPASSWORD = $PostgresPassword
            psql -h $PostgresHost -U $PostgresUser -p $PostgresPort -c "\q" 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✓ PostgreSQL está pronto!" -ForegroundColor Green
                Pop-Location
                return
            }
        }
        catch { }
        
        $attempts++
        Write-Host "  Tentativa $attempts/$maxAttempts..." -ForegroundColor Gray
        Start-Sleep -Seconds 1
    }
    
    Write-Host "✗ PostgreSQL não respondeu após $maxAttempts tentativas" -ForegroundColor Red
    Pop-Location
    exit 1
}

# Se usar Docker, iniciar containers
if ($UseDocker -or $StartDocker) {
    Start-PostgresDocker -DockerPath $DockerComposePath
}

Write-Host ""

# Verificar se psql está instalado
try {
    $psqlVersion = psql --version
    Write-Host "✓ PostgreSQL CLI encontrado: $psqlVersion" -ForegroundColor Green
}
catch {
    Write-Host "✗ PostgreSQL CLI (psql) não encontrado. Instale PostgreSQL Client Tools." -ForegroundColor Red
    Write-Host "  Você pode instalar apenas as ferramentas cliente do PostgreSQL" -ForegroundColor Yellow
    exit 1
}

# Configurar variável de ambiente para senha
$env:PGPASSWORD = $PostgresPassword

Write-Host ""
Write-Host "Configurações:" -ForegroundColor Yellow
Write-Host "  Host: $PostgresHost"
Write-Host "  User: $PostgresUser"
Write-Host "  Port: $PostgresPort"
Write-Host "  Docker: $(if ($UseDocker -or $StartDocker) { 'Sim' } else { 'Não' })"
Write-Host ""

# Lista de bases de dados a criar
$databases = @("nutri", "user_db")

Write-Host "Criando bases de dados..." -ForegroundColor Yellow
Write-Host ""

foreach ($db in $databases) {
    Write-Host "➜ Verificando e criando banco de dados: $db" -ForegroundColor Cyan
    
    # Verificar se o banco de dados existe
    $dbExists = psql -h $PostgresHost -U $PostgresUser -p $PostgresPort -lqt | Select-String "^$db\|" 
    
    if ($dbExists) {
        Write-Host "  ⚠ Banco de dados '$db' já existe. Pulando..." -ForegroundColor Yellow
    }
    else {
        psql -h $PostgresHost -U $PostgresUser -p $PostgresPort -c "CREATE DATABASE $db;"
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ Banco de dados '$db' criado com sucesso" -ForegroundColor Green
        }
        else {
            Write-Host "  ✗ Erro ao criar banco de dados '$db'" -ForegroundColor Red
            exit 1
        }
    }
}

Write-Host ""
Write-Host "Executando scripts de inicialização..." -ForegroundColor Yellow
Write-Host ""

# Script para o backend CHAT (nutri database)
Write-Host "➜ Inicializando backend CHAT (banco: nutri)" -ForegroundColor Cyan
$chatSchemaPath = "$PSScriptRoot\..\backend\chat\db\init\schema.sql"

if (Test-Path $chatSchemaPath) {
    psql -h $PostgresHost -U $PostgresUser -p $PostgresPort -d "nutri" -f $chatSchemaPath
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Schema do chat criado com sucesso" -ForegroundColor Green
    }
    else {
        Write-Host "  ✗ Erro ao executar schema do chat" -ForegroundColor Red
    }
}
else {
    Write-Host "  ✗ Arquivo de schema não encontrado: $chatSchemaPath" -ForegroundColor Red
}

Write-Host ""

# Scripts para o backend MONEY-MATE (user_db database)
Write-Host "➜ Inicializando backend MONEY-MATE (banco: user_db)" -ForegroundColor Cyan

$usersScriptPath = "$PSScriptRoot\..\backend\money-mate\data_base_scripts\create_users.sql"
$firstUserScriptPath = "$PSScriptRoot\..\backend\money-mate\data_base_scripts\first_user.sql"

# Criar tabelas de usuários
if (Test-Path $usersScriptPath) {
    # Modificar o script para não executar CREATE DATABASE (já foi criado)
    $usersContent = Get-Content $usersScriptPath -Raw
    $usersContent = $usersContent -replace "CREATE DATABASE user_db;", ""
    $usersContent = $usersContent -replace "\\c user_db;", ""
    
    $tempScriptPath = "$env:TEMP\create_users_temp.sql"
    Set-Content -Path $tempScriptPath -Value $usersContent
    
    psql -h $PostgresHost -U $PostgresUser -p $PostgresPort -d "user_db" -f $tempScriptPath
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Tabelas de usuários criadas com sucesso" -ForegroundColor Green
    }
    else {
        Write-Host "  ✗ Erro ao criar tabelas de usuários" -ForegroundColor Red
    }
    
    Remove-Item $tempScriptPath -Force
}
else {
    Write-Host "  ✗ Arquivo não encontrado: $usersScriptPath" -ForegroundColor Red
}

Write-Host ""

# Inserir usuário de teste
if (Test-Path $firstUserScriptPath) {
    Write-Host "➜ Inserindo dados de teste (usuário inicial)" -ForegroundColor Cyan
    psql -h $PostgresHost -U $PostgresUser -p $PostgresPort -d "user_db" -f $firstUserScriptPath
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Dados de teste inseridos com sucesso" -ForegroundColor Green
    }
    else {
        Write-Host "  ✗ Erro ao inserir dados de teste" -ForegroundColor Red
    }
}
else {
    Write-Host "  ✗ Arquivo não encontrado: $firstUserScriptPath" -ForegroundColor Red
}

# Limpar variável de ambiente
Remove-Item env:PGPASSWORD -Force

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Configuração de bancos de dados concluída!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Resumo:" -ForegroundColor Yellow
Write-Host "  • Banco de dados 'nutri' - Backend CHAT" -ForegroundColor White
Write-Host "  • Banco de dados 'user_db' - Backend MONEY-MATE" -ForegroundColor White
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "  1. Verifique a conexão com os bancos de dados"
Write-Host "  2. Configure as variáveis de ambiente (.env) se necessário"
Write-Host "  3. Inicie os serviços dos backends"
Write-Host ""
