# Script para setup de bancos de dados com Docker PostgreSQL
# Este script inicia o PostgreSQL em Docker e configura os bancos de dados

param(
    [string]$PostgresUser = "postgres",
    [string]$PostgresPassword = "postgres",
    [string]$PostgresPort = "5432",
    [switch]$Down = $false,
    [switch]$Restart = $false
)

Write-Host "================================" -ForegroundColor Cyan
Write-Host "NutriGPT - Docker Database Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Cores
$success = "Green"
$error = "Red"
$warning = "Yellow"
$info = "Cyan"

# Verificar Docker
function Verify-Docker {
    Write-Host "Verificando Docker..." -ForegroundColor $info
    
    try {
        $dockerVersion = docker --version
        Write-Host "✓ Docker encontrado: $dockerVersion" -ForegroundColor $success
        return $true
    }
    catch {
        Write-Host "✗ Docker não encontrado!" -ForegroundColor $error
        Write-Host "  Por favor, instale Docker Desktop: https://www.docker.com/products/docker-desktop" -ForegroundColor $warning
        return $false
    }
}

# Parar containers
function Stop-Containers {
    Write-Host ""
    Write-Host "Parando containers PostgreSQL..." -ForegroundColor $info
    
    $result = docker-compose -f docker-compose.db.yml down 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Containers parados com sucesso" -ForegroundColor $success
    }
    else {
        Write-Host "⚠ Aviso ao parar containers" -ForegroundColor $warning
    }
}

# Iniciar PostgreSQL
function Start-PostgreSQL {
    Write-Host ""
    Write-Host "Iniciando PostgreSQL com Docker..." -ForegroundColor $info
    
    # Verificar arquivo docker-compose
    if (-not (Test-Path "docker-compose.db.yml")) {
        Write-Host "✗ Arquivo docker-compose.db.yml não encontrado!" -ForegroundColor $error
        exit 1
    }
    
    # Iniciar containers
    Write-Host "Iniciando containers..." -ForegroundColor $info
    docker-compose -f docker-compose.db.yml up -d
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Erro ao iniciar Docker" -ForegroundColor $error
        exit 1
    }
    
    Write-Host "✓ Container PostgreSQL iniciado" -ForegroundColor $success
    
    # Aguardar PostgreSQL estar pronto
    Write-Host ""
    Write-Host "Aguardando PostgreSQL estar pronto..." -ForegroundColor $warning
    
    $attempts = 0
    $maxAttempts = 30
    $ready = $false
    
    while ($attempts -lt $maxAttempts) {
        try {
            $env:PGPASSWORD = $PostgresPassword
            $output = psql -h localhost -U $PostgresUser -p $PostgresPort -c "SELECT 1;" 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✓ PostgreSQL está pronto!" -ForegroundColor $success
                $ready = $true
                break
            }
        }
        catch { }
        
        $attempts++
        $remaining = $maxAttempts - $attempts
        Write-Host "  Tentativa $attempts/$maxAttempts... (aguardando $remaining)" -ForegroundColor $warning
        Start-Sleep -Seconds 1
    }
    
    if (-not $ready) {
        Write-Host "✗ PostgreSQL não respondeu após $maxAttempts tentativas" -ForegroundColor $error
        Write-Host ""
        Write-Host "Dicas de troubleshooting:" -ForegroundColor $warning
        Write-Host "  • Verifique se Docker está rodando"
        Write-Host "  • Verifique logs: docker-compose -f docker-compose.db.yml logs"
        Write-Host "  • Tente parar e reiniciar: docker-compose -f docker-compose.db.yml restart"
        exit 1
    }
}

# Criar bancos de dados
function Create-Databases {
    Write-Host ""
    Write-Host "Criando bancos de dados..." -ForegroundColor $info
    Write-Host ""
    
    $env:PGPASSWORD = $PostgresPassword
    
    # Lista de bancos
    $databases = @("nutri", "user_db")
    
    foreach ($db in $databases) {
        Write-Host "➜ Criando banco de dados: $db" -ForegroundColor $info
        
        # Verificar se existe
        $dbExists = psql -h localhost -U $PostgresUser -p $PostgresPort -lqt 2>&1 | Select-String "^$db\|"
        
        if ($dbExists) {
            Write-Host "  ⚠ Banco de dados '$db' já existe" -ForegroundColor $warning
        }
        else {
            psql -h localhost -U $PostgresUser -p $PostgresPort -c "CREATE DATABASE $db;" 2>&1 | Out-Null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  ✓ Banco de dados '$db' criado" -ForegroundColor $success
            }
            else {
                Write-Host "  ✗ Erro ao criar banco de dados '$db'" -ForegroundColor $error
            }
        }
    }
}

# Executar scripts SQL
function Execute-SQLScripts {
    Write-Host ""
    Write-Host "Executando scripts SQL..." -ForegroundColor $info
    Write-Host ""
    
    $env:PGPASSWORD = $PostgresPassword
    
    # Script do CHAT
    Write-Host "➜ Executando schema do backend CHAT" -ForegroundColor $info
    $chatScriptPath = ".\backend\chat\db\init\schema.sql"
    
    if (Test-Path $chatScriptPath) {
        psql -h localhost -U $PostgresUser -p $PostgresPort -d "nutri" -f $chatScriptPath 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ Schema do chat criado" -ForegroundColor $success
        }
        else {
            Write-Host "  ✗ Erro ao criar schema do chat" -ForegroundColor $error
        }
    }
    else {
        Write-Host "  ✗ Arquivo não encontrado: $chatScriptPath" -ForegroundColor $error
    }
    
    Write-Host ""
    
    # Scripts do MONEY-MATE
    Write-Host "➜ Executando schema do backend MONEY-MATE" -ForegroundColor $info
    
    $usersScriptPath = ".\backend\money-mate\data_base_scripts\create_users.sql"
    $firstUserScriptPath = ".\backend\money-mate\data_base_scripts\first_user.sql"
    
    if (Test-Path $usersScriptPath) {
        # Remover CREATE DATABASE do script
        $content = Get-Content $usersScriptPath -Raw
        $content = $content -replace "CREATE DATABASE user_db;", ""
        $content = $content -replace "\\c user_db;", ""
        
        $tempScript = "$env:TEMP\create_users_temp.sql"
        Set-Content -Path $tempScript -Value $content
        
        psql -h localhost -U $PostgresUser -p $PostgresPort -d "user_db" -f $tempScript 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ Tabelas de usuários criadas" -ForegroundColor $success
        }
        else {
            Write-Host "  ✗ Erro ao criar tabelas de usuários" -ForegroundColor $error
        }
        
        Remove-Item $tempScript -Force -ErrorAction SilentlyContinue
    }
    else {
        Write-Host "  ✗ Arquivo não encontrado: $usersScriptPath" -ForegroundColor $error
    }
    
    Write-Host ""
    
    if (Test-Path $firstUserScriptPath) {
        Write-Host "➜ Inserindo dados de teste" -ForegroundColor $info
        psql -h localhost -U $PostgresUser -p $PostgresPort -d "user_db" -f $firstUserScriptPath 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ Dados de teste inseridos" -ForegroundColor $success
        }
        else {
            Write-Host "  ✗ Erro ao inserir dados de teste" -ForegroundColor $error
        }
    }
}

# Main
try {
    # Verificar Docker
    if (-not (Verify-Docker)) {
        exit 1
    }
    
    # Se flag -Down, apenas parar e sair
    if ($Down) {
        Stop-Containers
        Write-Host ""
        Write-Host "Containers parados." -ForegroundColor $success
        Write-Host ""
        exit 0
    }
    
    # Se flag -Restart, parar primeiro
    if ($Restart) {
        Stop-Containers
        Start-Sleep -Seconds 2
    }
    
    # Iniciar PostgreSQL
    Start-PostgreSQL
    
    # Criar bancos
    Create-Databases
    
    # Executar scripts
    Execute-SQLScripts
    
    # Limpar
    Remove-Item env:PGPASSWORD -Force -ErrorAction SilentlyContinue
    
    # Sucesso
    Write-Host ""
    Write-Host "================================" -ForegroundColor $success
    Write-Host "Configuração concluída com sucesso!" -ForegroundColor $success
    Write-Host "================================" -ForegroundColor $success
    Write-Host ""
    Write-Host "Informações de conexão:" -ForegroundColor $info
    Write-Host "  Host: localhost"
    Write-Host "  Port: $PostgresPort"
    Write-Host "  User: $PostgresUser"
    Write-Host "  Bancos: nutri, user_db"
    Write-Host ""
    Write-Host "Próximos passos:" -ForegroundColor $warning
    Write-Host "  1. Configure as variáveis de ambiente nos backends (.env)"
    Write-Host "  2. Inicie os serviços dos backends"
    Write-Host "  3. Para parar: .\scripts\setup-databases-docker.ps1 -Down"
    Write-Host "  4. Para reiniciar: .\scripts\setup-databases-docker.ps1 -Restart"
    Write-Host ""
}
catch {
    Write-Host "✗ Erro: $_" -ForegroundColor $error
    exit 1
}
