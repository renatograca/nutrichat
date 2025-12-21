FROM python:3.11-slim

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Criar diretório de trabalho
WORKDIR /workspace

# Copiar requirements e instalar
COPY requirements.txt ./src
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo o código
COPY ./src/app ./app

# Expor porta do FastAPI
EXPOSE 8080
