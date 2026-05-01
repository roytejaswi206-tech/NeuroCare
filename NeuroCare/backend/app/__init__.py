import os
from flask import Flask, jsonify
from flask_cors import CORS
from app.config import Config
from app.extensions import db, jwt, migrate
from app.routes import auth_bp, health_bp, predict_bp, chat_bp, hospitals_bp
from app.utils.logger import logger
from app.models.hospital import Hospital
from app.models.doctor import Doctor


SAMPLE_HOSPITALS = [
    {
        'name': 'Horizon Mental Wellness Center',
        'address': '128 Hudson St, New York, NY',
        'lat': 40.7209,
        'lng': -74.0054,
        'contact': '2125550101',
        'rating': 4.7,
        'available_24x7': True,
        'mental_health_services': True,
    },
    {
        'name': 'Brooklyn Behavioral Health',
        'address': '45 Atlantic Ave, Brooklyn, NY',
        'lat': 40.6931,
        'lng': -73.9881,
        'contact': '7185550123',
        'rating': 4.5,
        'available_24x7': False,
        'mental_health_services': True,
    },
    {
        'name': 'Eastside Wellness Hospital',
        'address': '232 E 66th St, New York, NY',
        'lat': 40.7685,
        'lng': -73.9605,
        'contact': '2125550147',
        'rating': 4.8,
        'available_24x7': True,
        'mental_health_services': True,
    },
]

SAMPLE_DOCTORS = [
    {
        'name': 'Dr. Maya Patel',
        'specialization': 'Clinical Psychology',
        'qualification': 'PhD Psychology',
        'experience': 11,
        'timing': '9 AM - 5 PM',
        'fees': 120.0,
        'available': True,
        'phone': '2125550130',
    },
    {
        'name': 'Dr. David Lin',
        'specialization': 'Psychiatry',
        'qualification': 'MD Psychiatry',
        'experience': 14,
        'timing': '10 AM - 6 PM',
        'fees': 140.0,
        'available': True,
        'phone': '7185550161',
    },
    {
        'name': 'Dr. Sarah Morgan',
        'specialization': 'Behavioral Therapy',
        'qualification': 'MSW',
        'experience': 9,
        'timing': '8 AM - 4 PM',
        'fees': 110.0,
        'available': True,
        'phone': '2125550182',
    },
]


def seed_sample_data(app):
    with app.app_context():
        if Hospital.query.count() == 0:
            hospitals = []
            for hospital_data in SAMPLE_HOSPITALS:
                hospital = Hospital(**hospital_data)
                db.session.add(hospital)
                hospitals.append(hospital)

            db.session.commit()
            logger.info('Sample hospitals seeded')

            doctor_map = {
                hospitals[0].name: [SAMPLE_DOCTORS[0], SAMPLE_DOCTORS[2]],
                hospitals[1].name: [SAMPLE_DOCTORS[1]],
                hospitals[2].name: [SAMPLE_DOCTORS[0], SAMPLE_DOCTORS[1]],
            }

            for hospital in hospitals:
                doctor_list = doctor_map.get(hospital.name, [])
                for doctor_data in doctor_list:
                    doctor = Doctor(hospital_id=hospital.id, **doctor_data)
                    db.session.add(doctor)

            db.session.commit()
            logger.info('Sample doctors seeded')


def create_app(config_class=Config):
    """Create and configure the Flask application"""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Ensure SQLite instance path exists for local development
    database_uri = app.config.get('SQLALCHEMY_DATABASE_URI', '')
    if database_uri.startswith('sqlite:///'):
        db_path = database_uri[len('sqlite:///'):]
        if not os.path.isabs(db_path):
            db_path = os.path.abspath(os.path.join(os.getcwd(), db_path))
        os.makedirs(os.path.dirname(db_path), exist_ok=True)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(health_bp)
    app.register_blueprint(predict_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(hospitals_bp)
    
    # Health check route
    @app.route('/api/health')
    def health_check():
        return jsonify({
            'status': 'ok',
            'message': 'NeuroCare API is running'
        }), 200
    
    # Root route
    @app.route('/')
    def root():
        return jsonify({
            'message': 'Welcome to NeuroCare API',
            'version': '1.0.0',
            'docs': '/api/health'
        }), 200
    
    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            'error': 'Token has expired'
        }), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({
            'error': 'Invalid token'
        }), 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({
            'error': 'Authorization required'
        }), 401
    
    # Create database tables and seed sample data
    with app.app_context():
        db.create_all()
        seed_sample_data(app)
        logger.info("Database created and seeded")
    
    logger.info("NeuroCare Flask app created successfully")
    
    return app
