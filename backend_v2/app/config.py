import os
from app.core.secrets import get_secret

ENV = os.getenv("ENV", "local")
if ENV == "local":
    from dotenv import load_dotenv
    load_dotenv()

    
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

