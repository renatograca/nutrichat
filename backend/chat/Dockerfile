FROM python:3.11-slim

WORKDIR /app

# Instalar dependências do sistema (inclui curl para healthcheck e libpq para psycopg)
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
	   build-essential libpq-dev curl \
	&& rm -rf /var/lib/apt/lists/*

# Copiar e instalar dependências Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar o código da aplicação
COPY . .

EXPOSE 8080

ENV PORT=8080
ENV PYTHONUNBUFFERED=1

# Healthcheck para a rota /health
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s CMD curl -f http://127.0.0.1:${PORT:-8080}/health || exit 1

# Use uvicorn com workers em produção. PORT é injetado via env; sh -c faz a expansão.
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080} --workers 4"]
