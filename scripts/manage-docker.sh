#!/bin/bash

# Script auxiliar para gerenciar o Docker PostgreSQL do NutriGPT
# Uso: ./manage-docker.sh [start|stop|restart|logs|status|shell]

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

print_help() {
    cat << EOF
${CYAN}NutriGPT - Docker Manager${NC}

${YELLOW}Uso:${NC} ./manage-docker.sh [comando]

${YELLOW}Comandos:${NC}
  ${GREEN}start${NC}     Iniciar PostgreSQL (se não estiver rodando)
  ${GREEN}stop${NC}      Parar PostgreSQL
  ${GREEN}restart${NC}   Reiniciar PostgreSQL
  ${GREEN}logs${NC}      Ver logs em tempo real
  ${GREEN}status${NC}    Ver status dos containers
  ${GREEN}shell${NC}     Conectar ao container (bash)
  ${GREEN}psql${NC}      Conectar ao PostgreSQL (psql)
  ${GREEN}stats${NC}     Ver uso de recursos
  ${GREEN}help${NC}      Mostrar esta mensagem

${YELLOW}Exemplos:${NC}
  ./manage-docker.sh start
  ./manage-docker.sh logs
  ./manage-docker.sh psql
EOF
}

if [ -z "$1" ]; then
    print_help
    exit 0
fi

case "$1" in
    start)
        echo -e "${CYAN}Iniciando PostgreSQL...${NC}"
        docker-compose -f docker-compose.db.yml up -d
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ PostgreSQL iniciado com sucesso!${NC}"
            sleep 2
            docker-compose -f docker-compose.db.yml ps
        else
            echo -e "${RED}✗ Erro ao iniciar PostgreSQL${NC}"
            exit 1
        fi
        ;;
    stop)
        echo -e "${CYAN}Parando PostgreSQL...${NC}"
        docker-compose -f docker-compose.db.yml stop
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ PostgreSQL parado!${NC}"
        else
            echo -e "${RED}✗ Erro ao parar PostgreSQL${NC}"
            exit 1
        fi
        ;;
    restart)
        echo -e "${CYAN}Reiniciando PostgreSQL...${NC}"
        docker-compose -f docker-compose.db.yml restart
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ PostgreSQL reiniciado com sucesso!${NC}"
            sleep 2
            docker-compose -f docker-compose.db.yml ps
        else
            echo -e "${RED}✗ Erro ao reiniciar PostgreSQL${NC}"
            exit 1
        fi
        ;;
    logs)
        echo -e "${CYAN}Mostrando logs (Ctrl+C para sair)...${NC}"
        docker-compose -f docker-compose.db.yml logs -f
        ;;
    status)
        echo -e "${CYAN}Status dos containers:${NC}"
        docker-compose -f docker-compose.db.yml ps
        echo ""
        echo -e "${CYAN}Volumes:${NC}"
        docker volume ls | grep postgres
        ;;
    shell)
        echo -e "${CYAN}Conectando ao container bash...${NC}"
        docker exec -it nutrigpt-postgres bash
        ;;
    psql)
        echo -e "${CYAN}Conectando ao PostgreSQL...${NC}"
        docker exec -it nutrigpt-postgres psql -U postgres
        ;;
    stats)
        echo -e "${CYAN}Recursos do container (Ctrl+C para sair):${NC}"
        docker stats nutrigpt-postgres
        ;;
    help|-h|--help)
        print_help
        ;;
    *)
        echo -e "${RED}✗ Comando desconhecido: $1${NC}"
        echo ""
        print_help
        exit 1
        ;;
esac
