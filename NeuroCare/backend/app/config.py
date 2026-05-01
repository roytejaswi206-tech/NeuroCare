import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parents[1]
DEFAULT_DATABASE_URI = f"sqlite:///{(BASE_DIR / 'instance' / 'neurocare.db').as_posix()}"
RAW_DB_URI = os.getenv('SQLALCHEMY_DATABASE_URI', None)
if RAW_DB_URI and RAW_DB_URI.startswith('sqlite:///'):
    relative_db_path = RAW_DB_URI[len('sqlite:///'):]
    if not Path(relative_db_path).is_absolute():
        SQLALCHEMY_DATABASE_URI = f"sqlite:///{(BASE_DIR / relative_db_path).as_posix()}"
    else:
        SQLALCHEMY_DATABASE_URI = RAW_DB_URI
else:
    SQLALCHEMY_DATABASE_URI = RAW_DB_URI or DEFAULT_DATABASE_URI

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'dev-jwt-secret-key-change-in-production')
    SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_TOKEN_LOCATION = ['headers']
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours
