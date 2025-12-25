# Uso

## Rodando localmente (sem Docker)

1. Ative o ambiente virtual
2. Instale dependências: `pip install -r requirements.txt`
3. Rode o servidor:

```powershell
python -m uvicorn app.main:app --reload
```

O servidor estará em `http://127.0.0.1:8000`.

## Endpoints de documentação interativa

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## Rodando com Docker

1. Build da imagem:

```powershell
docker build -t nutrichat-backend .
```

2. Subir com docker-compose:

```powershell
docker-compose up --build
```

Após o `up`, a API estará disponível em `http://localhost:8000`.
