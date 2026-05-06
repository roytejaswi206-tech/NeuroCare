from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app.extensions import db
from app.models.user import User
import bcrypt

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return jsonify({'error': 'All fields required'}), 400

        existing = User.query.filter(
            (User.email == email) | (User.username == username)
        ).first()

        if existing:
            return jsonify({'error': 'User already exists'}), 409

        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        user = User(
            username=username,
            email=email,
            password_hash=hashed.decode('utf-8')
        )

        db.session.add(user)
        db.session.commit()

        return jsonify({'message': 'Registered successfully'}), 201

    except Exception as e:
        print("REGISTER ERROR:", e)
        return jsonify({'error': 'Registration failed'}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        email = data.get('email')
        password = data.get('password')

        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({'error': 'User not found'}), 404

        if not bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
            return jsonify({'error': 'Wrong password'}), 401

        token = create_access_token(identity=str(user.id))

        return jsonify({
            'message': 'Login success',
            'token': token,
            'user': user.to_dict()
        }), 200

    except Exception as e:
        print("LOGIN ERROR:", e)
        return jsonify({'error': 'Login failed'}), 500
