#!/bin/bash

# Script de validação para verificar se o setup de bancos de dados funcionou
# Uso: ./validate-setup.sh

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

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
check_docker() {
    print_info "Verificando Docker..."
    
    if command -v docker &> /dev/null; then
        print_success "Docker está instalado"
        return 0
    else
        print_warning "Docker não está instalado (opcional)"
        return 1
    fi
}

# Verificar psql
check_psql() {
    print_info "Verificando PostgreSQL Client (psql)..."
    
    if command -v psql &> /dev/null; then
        print_success "psql está instalado"
        return 0
    else
        print_error "psql não está instalado - necessário para conexão"
        return 1
    fi
}

# Verificar container PostgreSQL
check_postgres_container() {
    print_info "Verificando container PostgreSQL..."
    
    if docker ps 2>/dev/null | grep -q "nutrigpt-postgres"; then
        print_success "Container PostgreSQL está rodando"
        return 0
    else
        print_warning "Container PostgreSQL não está em execução"
        return 1
    fi
}

# Verificar conexão com PostgreSQL
check_postgres_connection() {
    print_info "Verificando conexão com PostgreSQL..."
    
    export PGPASSWORD="postgres"
    
    if psql -h localhost -U postgres -p 5432 -c "SELECT 1;" &>/dev/null 2>&1; then
        print_success "Conectado ao PostgreSQL com sucesso"
        unset PGPASSWORD
        return 0
    else
        print_warning "Não foi possível conectar ao PostgreSQL"
        unset PGPASSWORD
        return 1
    fi
}

# Verificar bancos de dados
check_databases() {
    print_info "Verificando bancos de dados..."
    
    export PGPASSWORD="postgres"
    
    # Banco nutri
    if psql -h localhost -U postgres -p 5432 -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw "nutri"; then
        print_success "Banco 'nutri' existe"
    else
        print_error "Banco 'nutri' não encontrado"
    fi
    
    # Banco user_db
    if psql -h localhost -U postgres -p 5432 -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw "user_db"; then
        print_success "Banco 'user_db' existe"
    else
        print_error "Banco 'user_db' não encontrado"
    fi
    
    unset PGPASSWORD
}

# Verificar tabelas
check_tables() {
    print_info "Verificando tabelas..."
    
    export PGPASSWORD="postgres"
    
    # Tabelas do banco nutri
    if psql -h localhost -U postgres -p 5432 -d nutri -c "\dt" 2>/dev/null | grep -q "vector_store"; then
        print_success "Tabela 'vector_store' existe (nutri)"
    else
        print_warning "Tabela 'vector_store' não encontrada (nutri)"
    fi
    
    if psql -h localhost -U postgres -p 5432 -d nutri -c "\dt" 2>/dev/null | grep -q "chats"; then
        print_success "Tabela 'chats' existe (nutri)"
    else
        print_warning "Tabela 'chats' não encontrada (nutri)"
    fi
    
    # Tabelas do banco user_db
    if psql -h localhost -U postgres -p 5432 -d user_db -c "\dt" 2>/dev/null | grep -q "users"; then
        print_success "Tabela 'users' existe (user_db)"
    else
        print_warning "Tabela 'users' não encontrada (user_db)"
    fi
    
    unset PGPASSWORD
}

# Verificar dados de teste
check_test_data() {
    print_info "Verificando dados de teste..."
    
    export PGPASSWORD="postgres"
    
    user_count=$(psql -h localhost -U postgres -p 5432 -d user_db -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null)
    
    if [ "$user_count" -gt 0 ]; then
        print_success "Dados de teste encontrados ($user_count usuário(s))"
    else
        print_warning "Nenhum dado de teste encontrado"
    fi
    
    unset PGPASSWORD
}

# Main
print_header "NutriGPT - Setup Validation"

echo "Executando verificações..."
echo ""

# Verificações
check_docker
psql_ok=$?

if [ $psql_ok -ne 0 ]; then
    print_error "psql é necessário para validação - instale PostgreSQL Client Tools"
    exit 1
fi

echo ""

check_psql
check_postgres_container
check_postgres_connection
check_databases
check_tables
check_test_data

echo ""
print_header "Validação Concluída!"

echo "Próximos passos:"
echo "  1. Configure as variáveis de ambiente nos backends (.env)"
echo "  2. Inicie os backends (chat e money-mate)"
echo "  3. Teste as APIs dos backends"
echo ""
