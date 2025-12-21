# Instalação

Este guia assume que você está na pasta raiz do projeto `backend_v2`.

## Requisitos

- Python 3.11+
- pip
- (opcional) Docker e Docker Compose

## Ambiente virtual (recomendado)

Windows (PowerShell):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Atualizar pip e instalar dependências:

```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

## Ferramentas de documentação (opcional)

Para servir a documentação localmente com MkDocs (gera HTML a partir do Markdown):

```powershell
pip install mkdocs mkdocstrings mkdocs-material
mkdocs serve -a 127.0.0.1:8000
```

Isso abre a documentação localmente em http://127.0.0.1:8000
