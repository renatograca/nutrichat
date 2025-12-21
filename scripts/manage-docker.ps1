# Script auxiliar para gerenciar o Docker PostgreSQL do NutriGPT
# Uso: .\manage-docker.ps1 [start|stop|restart|logs|status|shell|psql|stats]

param(
    [string]$Command = "help",
    [switch]$Follow = $false
)

$colors = @{
    Red = "Red"
    Green = "Green"
    Yellow = "Yellow"
    Cyan = "Cyan"
}

function Show-Help {
    Write-Host ""
    Write-Host "NutriGPT - Docker Manager" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Uso: .\manage-docker.ps1 [comando]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Comandos:" -ForegroundColor Yellow
    Write-Host "  start     Iniciar PostgreSQL (se não estiver rodando)" -ForegroundColor Green
    Write-Host "  stop      Parar PostgreSQL" -ForegroundColor Green
    Write-Host "  restart   Reiniciar PostgreSQL" -ForegroundColor Green
    Write-Host "  logs      Ver logs em tempo real" -ForegroundColor Green
    Write-Host "  status    Ver status dos containers" -ForegroundColor Green
    Write-Host "  shell     Conectar ao container (bash)" -ForegroundColor Green
    Write-Host "  psql      Conectar ao PostgreSQL (psql)" -ForegroundColor Green
    Write-Host "  stats     Ver uso de recursos" -ForegroundColor Green
    Write-Host "  help      Mostrar esta mensagem" -ForegroundColor Green
    Write-Host ""
    Write-Host "Exemplos:" -ForegroundColor Yellow
    Write-Host "  .\manage-docker.ps1 start" -ForegroundColor White
    Write-Host "  .\manage-docker.ps1 logs" -ForegroundColor White
    Write-Host "  .\manage-docker.ps1 psql" -ForegroundColor White
    Write-Host ""
}

function Check-Docker {
    try {
        docker ps > $null 2>&1
        return $true
    }
    catch {
        Write-Host "✗ Docker não está em execução ou não foi encontrado" -ForegroundColor Red
        return $false
    }
}

function Check-Container {
    $container = docker ps -a --format "table {{.Names}}" | Select-String "nutrigpt-postgres"
    return $null -ne $container
}

switch ($Command.ToLower()) {
    "start" {
        Write-Host "Iniciando PostgreSQL..." -ForegroundColor Cyan
        
        if (-not (Check-Docker)) { exit 1 }
        
        docker-compose -f docker-compose.db.yml up -d
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ PostgreSQL iniciado com sucesso!" -ForegroundColor Green
            Start-Sleep -Seconds 2
            docker-compose -f docker-compose.db.yml ps
        }
        else {
            Write-Host "✗ Erro ao iniciar PostgreSQL" -ForegroundColor Red
            exit 1
        }
    }
    
    "stop" {
        Write-Host "Parando PostgreSQL..." -ForegroundColor Cyan
        
        if (-not (Check-Docker)) { exit 1 }
        
        docker-compose -f docker-compose.db.yml stop
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ PostgreSQL parado!" -ForegroundColor Green
        }
        else {
            Write-Host "✗ Erro ao parar PostgreSQL" -ForegroundColor Red
            exit 1
        }
    }
    
    "restart" {
        Write-Host "Reiniciando PostgreSQL..." -ForegroundColor Cyan
        
        if (-not (Check-Docker)) { exit 1 }
        
        docker-compose -f docker-compose.db.yml restart
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ PostgreSQL reiniciado com sucesso!" -ForegroundColor Green
            Start-Sleep -Seconds 2
            docker-compose -f docker-compose.db.yml ps
        }
        else {
            Write-Host "✗ Erro ao reiniciar PostgreSQL" -ForegroundColor Red
            exit 1
        }
    }
    
    "logs" {
        Write-Host "Mostrando logs (Ctrl+C para sair)..." -ForegroundColor Cyan
        
        if (-not (Check-Docker)) { exit 1 }
        
        docker-compose -f docker-compose.db.yml logs -f
    }
    
    "status" {
        Write-Host "Status dos containers:" -ForegroundColor Cyan
        
        if (-not (Check-Docker)) { exit 1 }
        
        docker-compose -f docker-compose.db.yml ps
        
        Write-Host ""
        Write-Host "Volumes:" -ForegroundColor Cyan
        docker volume ls | Select-String "postgres"
    }
    
    "shell" {
        Write-Host "Conectando ao container bash..." -ForegroundColor Cyan
        
        if (-not (Check-Docker)) { exit 1 }
        
        if (-not (Check-Container)) {
            Write-Host "✗ Container PostgreSQL não está em execução" -ForegroundColor Red
            exit 1
        }
        
        docker exec -it nutrigpt-postgres bash
    }
    
    "psql" {
        Write-Host "Conectando ao PostgreSQL..." -ForegroundColor Cyan
        
        if (-not (Check-Docker)) { exit 1 }
        
        if (-not (Check-Container)) {
            Write-Host "✗ Container PostgreSQL não está em execução" -ForegroundColor Red
            exit 1
        }
        
        $env:PGPASSWORD = "postgres"
        docker exec -it nutrigpt-postgres psql -U postgres
        Remove-Item env:PGPASSWORD -Force -ErrorAction SilentlyContinue
    }
    
    "stats" {
        Write-Host "Recursos do container (Ctrl+C para sair):" -ForegroundColor Cyan
        
        if (-not (Check-Docker)) { exit 1 }
        
        if (-not (Check-Container)) {
            Write-Host "✗ Container PostgreSQL não está em execução" -ForegroundColor Red
            exit 1
        }
        
        docker stats nutrigpt-postgres
    }
    
    "help" {
        Show-Help
    }
    
    default {
        Write-Host "✗ Comando desconhecido: $Command" -ForegroundColor Red
        Write-Host ""
        Show-Help
        exit 1
    }
}
