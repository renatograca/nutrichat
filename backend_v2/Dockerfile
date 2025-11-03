# Use Python 3.11
FROM python:3.11-slim

# Definir diretório de trabalho
WORKDIR ./src/app /app

# Copiar requirements e instalar dependências
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo o código
COPY ./src/app /app 

# Expor a porta da API
EXPOSE 8080

# Comando para rodar o FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
