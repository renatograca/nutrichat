"""Application configuration read from environment.

This module centralizes reading environment variables and provides a
single `DATABASE_URL` and `PORT` value suitable for local and cloud
deployments. If ENV is `local` the `.env` file will be loaded (developer
convenience).
"""
import os
from app.core.secrets import get_secret

ENV = os.getenv("ENV", "local")
if ENV == "local":
    # load .env during local development
    from dotenv import load_dotenv

    load_dotenv()

# Prefer a single DATABASE_URL env var; fall back to individual parts.
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_USER = os.getenv("DB_USER", "postgres")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")
    DB_NAME = os.getenv("DB_NAME", "nutri")
    DB_PORT = os.getenv("DB_PORT", "5432")
    DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# API keys and other secrets
OPENAI_API_KEY = get_secret("OPENAI_API_KEY", default=None)
GOOGLE_API_KEY = get_secret("GOOGLE_API_KEY", default=None)

# Port for the HTTP server (container/platform will typically set this)
PORT = int(os.getenv("PORT", "8080"))

