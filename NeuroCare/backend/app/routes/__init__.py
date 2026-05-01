from app.routes.auth import auth_bp
from app.routes.health import health_bp
from app.routes.predict import predict_bp
from app.routes.chat import chat_bp
from app.routes.hospitals import hospitals_bp

__all__ = ['auth_bp', 'health_bp', 'predict_bp', 'chat_bp', 'hospitals_bp']
