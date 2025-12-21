#!/bin/bash

# Script para setup de bancos de dados com Docker PostgreSQL
# Este script inicia o PostgreSQL em Docker e configura os bancos de dados
# Uso: ./setup-databases-docker.sh [down|restart]

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Parâmetros
ACTION="${1:-start}"  # start, down, restart
POSTGRES_USER="${POSTGRES_USER:-postgres}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-postgres}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"
POSTGRES_HOST="localhost"

# Funções de output
print_header() {
    echo -e "\n${CYAN}================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${CYAN}➜ $1${NC}"
}

# Verificar Docker
verify_docker() {
    print_info "Verificando Docker..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker não encontrado!"
        echo -e "${YELLOW}  Por favor, instale Docker: https://www.docker.com/products/docker-desktop${NC}"
        return 1
    fi
    
    docker_version=$(docker --version)
    print_success "Docker encontrado: $docker_version"
    return 0
}

# Parar containers
stop_containers() {
    print_info "Parando containers PostgreSQL..."
    
    if docker-compose -f docker-compose.db.yml down 2>/dev/null; then
        print_success "Containers parados com sucesso"
    else
        print_warning "Aviso ao parar containers"
    fi
}

# Iniciar PostgreSQL
start_postgresql() {
    echo ""
    print_info "Iniciando PostgreSQL com Docker..."
    
    # Verificar docker-compose
    if [ ! -f "docker-compose.db.yml" ]; then
        print_error "Arquivo docker-compose.db.yml não encontrado!"
        return 1
    fi
    
    # Iniciar containers
    print_info "Iniciando containers..."
    docker-compose -f docker-compose.db.yml up -d
    
    if [ $? -ne 0 ]; then
        print_error "Erro ao iniciar Docker"
        return 1
    fi
    
    print_success "Container PostgreSQL iniciado"
    
    # Aguardar PostgreSQL estar pronto
    echo ""
    print_warning "Aguardando PostgreSQL estar pronto..."
    
    local attempts=0
    local max_attempts=30
    
    while [ $attempts -lt $max_attempts ]; do
        export PGPASSWORD=$POSTGRES_PASSWORD
        
        if psql -h $POSTGRES_HOST -U $POSTGRES_USER -p $POSTGRES_PORT -c "SELECT 1;" &>/dev/null; then
            print_success "PostgreSQL está pronto!"
            unset PGPASSWORD
            return 0
        fi
        
        attempts=$((attempts + 1))
        remaining=$((max_attempts - attempts))
        print_warning "Tentativa $attempts/$max_attempts... (aguardando $remaining)"
        sleep 1
    done
    
    print_error "PostgreSQL não respondeu após $max_attempts tentativas"
    echo ""
    print_warning "Dicas de troubleshooting:"
    echo "  • Verifique se Docker está rodando"
    echo "  • Verifique logs: docker-compose -f docker-compose.db.yml logs"
    echo "  • Tente reiniciar: docker-compose -f docker-compose.db.yml restart"
    unset PGPASSWORD
    return 1
}

# Criar bancos de dados
create_databases() {
    echo ""
    print_info "Criando bancos de dados..."
    echo ""
    
    export PGPASSWORD=$POSTGRES_PASSWORD
    
    local databases=("nutri" "user_db")
    
    for db in "${databases[@]}"; do
        print_info "Criando banco de dados: $db"
        
        # Verificar se existe
        if psql -h $POSTGRES_HOST -U $POSTGRES_USER -p $POSTGRES_PORT -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw $db; then
            print_warning "Banco de dados '$db' já existe"
        else
            if psql -h $POSTGRES_HOST -U $POSTGRES_USER -p $POSTGRES_PORT -c "CREATE DATABASE $db;" &>/dev/null; then
                print_success "Banco de dados '$db' criado"
            else
                print_error "Erro ao criar banco de dados '$db'"
            fi
        fi
    done
    
    unset PGPASSWORD
}

# Executar scripts SQL
execute_sql_scripts() {
    echo ""
    print_info "Executando scripts SQL..."
    echo ""
    
    export PGPASSWORD=$POSTGRES_PASSWORD
    
    # Script do CHAT
    print_info "Executando schema do backend CHAT"
    CHAT_SCRIPT_PATH="./backend/chat/db/init/schema.sql"
    
    if [ -f "$CHAT_SCRIPT_PATH" ]; then
        if psql -h $POSTGRES_HOST -U $POSTGRES_USER -p $POSTGRES_PORT -d "nutri" -f "$CHAT_SCRIPT_PATH" &>/dev/null; then
            print_success "Schema do chat criado"
        else
            print_error "Erro ao criar schema do chat"
        fi
    else
        print_error "Arquivo não encontrado: $CHAT_SCRIPT_PATH"
    fi
    
    echo ""
    
    # Scripts do MONEY-MATE
    print_info "Executando schema do backend MONEY-MATE"
    USERS_SCRIPT_PATH="./backend/money-mate/data_base_scripts/create_users.sql"
    FIRST_USER_SCRIPT_PATH="./backend/money-mate/data_base_scripts/first_user.sql"
    
    if [ -f "$USERS_SCRIPT_PATH" ]; then
        # Remover CREATE DATABASE do script
        temp_script=$(mktemp)
        sed '/CREATE DATABASE user_db;/d; /\\c user_db;/d' "$USERS_SCRIPT_PATH" > "$temp_script"
        
        if psql -h $POSTGRES_HOST -U $POSTGRES_USER -p $POSTGRES_PORT -d "user_db" -f "$temp_script" &>/dev/null; then
            print_success "Tabelas de usuários criadas"
        else
            print_error "Erro ao criar tabelas de usuários"
        fi
        
        rm "$temp_script"
    else
        print_error "Arquivo não encontrado: $USERS_SCRIPT_PATH"
    fi
    
    echo ""
    
    if [ -f "$FIRST_USER_SCRIPT_PATH" ]; then
        print_info "Inserindo dados de teste"
        if psql -h $POSTGRES_HOST -U $POSTGRES_USER -p $POSTGRES_PORT -d "user_db" -f "$FIRST_USER_SCRIPT_PATH" &>/dev/null; then
            print_success "Dados de teste inseridos"
        else
            print_error "Erro ao inserir dados de teste"
        fi
    fi
    
    unset PGPASSWORD
}

# Main
print_header "NutriGPT - Docker Database Setup"

# Verificar Docker
if ! verify_docker; then
    exit 1
fi

echo ""
echo "Configurações:"
echo "  Host: $POSTGRES_HOST"
echo "  Port: $POSTGRES_PORT"
echo "  User: $POSTGRES_USER"
echo ""

# Mudar para diretório do projeto
cd "$(dirname "$0")/.." || exit 1

case "$ACTION" in
    down)
        stop_containers
        echo ""
        print_success "Containers parados."
        echo ""
        exit 0
        ;;
    restart)
        stop_containers
        sleep 2
        start_postgresql || exit 1
        create_databases
        execute_sql_scripts
        ;;
    *)  # start
        start_postgresql || exit 1
        create_databases
        execute_sql_scripts
        ;;
esac

# Sucesso
echo ""
print_header "Configuração concluída com sucesso!"

echo "Informações de conexão:"
echo "  Host: $POSTGRES_HOST"
echo "  Port: $POSTGRES_PORT"
echo "  User: $POSTGRES_USER"
echo "  Bancos: nutri, user_db"
echo ""
echo "Próximos passos:"
echo "  1. Configure as variáveis de ambiente nos backends (.env)"
echo "  2. Inicie os serviços dos backends"
echo "  3. Para parar: ./scripts/setup-databases-docker.sh down"
echo "  4. Para reiniciar: ./scripts/setup-databases-docker.sh restart"
echo ""
