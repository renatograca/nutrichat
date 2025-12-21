# Script de validação para verificar se o setup de bancos de dados funcionou
# Uso: .\validate-setup.ps1

Write-Host "================================" -ForegroundColor Cyan
Write-Host "NutriGPT - Setup Validation" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Executando verificações..." -ForegroundColor Yellow
Write-Host ""

# Verificar Docker
Write-Host "Verificando Docker..." -ForegroundColor Cyan
$dockerInstalled = $false
try {
    $dockerVersion = docker --version
    Write-Host "✓ Docker está instalado: $dockerVersion" -ForegroundColor Green
    $dockerInstalled = $true
}
catch {
    Write-Host "⚠ Docker não está instalado (opcional)" -ForegroundColor Yellow
}

# Verificar psql
Write-Host ""
Write-Host "Verificando PostgreSQL Client (psql)..." -ForegroundColor Cyan
try {
    psql --version | Out-Null
    Write-Host "✓ psql está instalado" -ForegroundColor Green
    $psqlInstalled = $true
}
catch {
    Write-Host "✗ psql não está instalado - necessário para conexão" -ForegroundColor Red
    $psqlInstalled = $false
}

if (-not $psqlInstalled) {
    Write-Host ""
    Write-Host "Instale PostgreSQL Client Tools para continuar:" -ForegroundColor Yellow
    Write-Host "  https://www.postgresql.org/download/windows/" -ForegroundColor Gray
    exit 1
}

# Verificar container PostgreSQL
if ($dockerInstalled) {
    Write-Host ""
    Write-Host "Verificando container PostgreSQL..." -ForegroundColor Cyan
    try {
        $container = docker ps 2>&1 | Select-String "nutrigpt-postgres"
        if ($null -ne $container) {
            Write-Host "✓ Container PostgreSQL está rodando" -ForegroundColor Green
            $containerRunning = $true
        }
        else {
            Write-Host "⚠ Container PostgreSQL não está em execução" -ForegroundColor Yellow
            $containerRunning = $false
        }
    }
    catch {
        Write-Host "⚠ Erro ao verificar container" -ForegroundColor Yellow
        $containerRunning = $false
    }
}

# Verificar conexão com PostgreSQL
Write-Host ""
Write-Host "Verificando conexão com PostgreSQL..." -ForegroundColor Cyan
$env:PGPASSWORD = "postgres"
try {
    psql -h localhost -U postgres -p 5432 -c "SELECT 1;" 2>$null | Out-Null
    Write-Host "✓ Conectado ao PostgreSQL com sucesso" -ForegroundColor Green
    $connectionOk = $true
}
catch {
    Write-Host "⚠ Não foi possível conectar ao PostgreSQL" -ForegroundColor Yellow
    $connectionOk = $false
}

if ($connectionOk) {
    # Verificar bancos de dados
    Write-Host ""
    Write-Host "Verificando bancos de dados..." -ForegroundColor Cyan
    
    $databases = psql -h localhost -U postgres -p 5432 -lqt 2>$null
    
    if ($databases | Select-String "^nutri\|") {
        Write-Host "✓ Banco 'nutri' existe" -ForegroundColor Green
    }
    else {
        Write-Host "✗ Banco 'nutri' não encontrado" -ForegroundColor Red
    }
    
    if ($databases | Select-String "^user_db\|") {
        Write-Host "✓ Banco 'user_db' existe" -ForegroundColor Green
    }
    else {
        Write-Host "✗ Banco 'user_db' não encontrado" -ForegroundColor Red
    }
    
    # Verificar tabelas
    Write-Host ""
    Write-Host "Verificando tabelas..." -ForegroundColor Cyan
    
    # Tabelas nutri
    $nutriTables = psql -h localhost -U postgres -p 5432 -d nutri -c "\dt" 2>$null
    
    if ($nutriTables -like "*vector_store*") {
        Write-Host "✓ Tabela 'vector_store' existe (nutri)" -ForegroundColor Green
    }
    else {
        Write-Host "⚠ Tabela 'vector_store' não encontrada (nutri)" -ForegroundColor Yellow
    }
    
    if ($nutriTables -like "*chats*") {
        Write-Host "✓ Tabela 'chats' existe (nutri)" -ForegroundColor Green
    }
    else {
        Write-Host "⚠ Tabela 'chats' não encontrada (nutri)" -ForegroundColor Yellow
    }
    
    # Tabelas user_db
    $userTables = psql -h localhost -U postgres -p 5432 -d user_db -c "\dt" 2>$null
    
    if ($userTables -like "*users*") {
        Write-Host "✓ Tabela 'users' existe (user_db)" -ForegroundColor Green
    }
    else {
        Write-Host "✗ Tabela 'users' não encontrada (user_db)" -ForegroundColor Red
    }
    
    # Verificar dados de teste
    Write-Host ""
    Write-Host "Verificando dados de teste..." -ForegroundColor Cyan
    
    $userCount = psql -h localhost -U postgres -p 5432 -d user_db -t -c "SELECT COUNT(*) FROM users;" 2>$null
    
    if ($userCount -gt 0) {
        Write-Host "✓ Dados de teste encontrados ($userCount usuário(s))" -ForegroundColor Green
    }
    else {
        Write-Host "⚠ Nenhum dado de teste encontrado" -ForegroundColor Yellow
    }
}

Remove-Item env:PGPASSWORD -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "Validação Concluída!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "  1. Configure as variáveis de ambiente nos backends (.env)" -ForegroundColor White
Write-Host "  2. Inicie os backends (chat e money-mate)" -ForegroundColor White
Write-Host "  3. Teste as APIs dos backends" -ForegroundColor White
Write-Host ""
