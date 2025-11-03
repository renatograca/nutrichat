import os

DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/nutri"
)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
