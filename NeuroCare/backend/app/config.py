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

    MAIL_SERVER = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.getenv('MAIL_PORT', 587))
    MAIL_USE_TLS = os.getenv('MAIL_USE_TLS', 'True').lower() in ['1', 'true', 'yes']
    MAIL_USE_SSL = os.getenv('MAIL_USE_SSL', 'False').lower() in ['1', 'true', 'yes']
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER', MAIL_USERNAME or 'no-reply@neurocare.local')
