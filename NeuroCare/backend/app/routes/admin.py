from functools import wraps
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from app.extensions import db
from app.models.user import User
from app.models.hospital import Hospital
from app.models.doctor import Doctor
from app.models.appointment import Appointment
from app.models.panic_alert import PanicAlert
from app.models.chat_log import ChatLog
from app.models.system_setting import SystemSetting
from app.utils.logger import logger
from datetime import datetime

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')


def _get_identity_id(identity):
    if isinstance(identity, dict):
        return identity.get('id')
    return identity


def _get_current_user():
    user_id = _get_identity_id(get_jwt_identity())
    try:
        user_id = int(user_id)
    except (TypeError, ValueError):
        return None
    return User.query.get(user_id)


def super_admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        jwt_claims = get_jwt() or {}
        role = jwt_claims.get('role')
        if role != 'super_admin':
            return jsonify({'error': 'Insufficient permissions'}), 403
        return fn(*args, **kwargs)
    return wrapper


def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        jwt_claims = get_jwt() or {}
        role = jwt_claims.get('role')
        if role not in ['super_admin', 'admin']:
            return jsonify({'error': 'Admin access required'}), 403
        return fn(*args, **kwargs)
    return wrapper


@admin_bp.route('/stats', methods=['GET'])
@admin_required
def system_stats():
    try:
        total_users = User.query.count()
        active_users = User.query.filter_by(is_active=True).count()
        panic_alerts = PanicAlert.query.count()
        appointments = Appointment.query.count()
        doctors = Doctor.query.count()
        hospitals = Hospital.query.count()

        return jsonify({
            'total_users': total_users,
            'active_users': active_users,
            'panic_alerts': panic_alerts,
            'appointments': appointments,
            'doctors': doctors,
            'hospitals': hospitals,
        }), 200
    except Exception as e:
        logger.error(f"Admin stats error: {str(e)}")
        return jsonify({'error': 'Failed to fetch statistics'}), 500


@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users():
    try:
        users = User.query.order_by(User.created_at.desc()).all()
        return jsonify({'users': [u.to_dict() for u in users]}), 200
    except Exception as e:
        logger.error(f"Admin get users error: {str(e)}")
        return jsonify({'error': 'Failed to fetch users'}), 500


@admin_bp.route('/users/<int:user_id>', methods=['PATCH'])
@super_admin_required
def update_user(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        data = request.get_json() or {}
        if 'role' in data and data['role'] in ['user', 'admin', 'super_admin']:
            user.role = data['role']
        if 'is_active' in data:
            user.is_active = bool(data['is_active'])

        db.session.commit()
        return jsonify({'user': user.to_dict()}), 200
    except Exception as e:
        logger.error(f"Admin update user error: {str(e)}")
        return jsonify({'error': 'Failed to update user'}), 500


@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@super_admin_required
def delete_user(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        logger.error(f"Admin delete user error: {str(e)}")
        return jsonify({'error': 'Failed to delete user'}), 500


@admin_bp.route('/hospitals', methods=['GET'])
@admin_required
def get_admin_hospitals():
    try:
        hospitals = Hospital.query.order_by(Hospital.name.asc()).all()
        return jsonify({'hospitals': [h.to_dict() for h in hospitals]}), 200
    except Exception as e:
        logger.error(f"Admin get hospitals error: {str(e)}")
        return jsonify({'error': 'Failed to fetch hospitals'}), 500


@admin_bp.route('/hospitals', methods=['POST'])
@admin_required
def create_hospital():
    try:
        data = request.get_json() or {}
        if not data.get('name') or data.get('lat') is None or data.get('lng') is None:
            return jsonify({'error': 'Name, latitude, and longitude are required'}), 400

        hospital = Hospital(
            name=data['name'],
            address=data.get('address'),
            lat=data['lat'],
            lng=data['lng'],
            contact=data.get('contact'),
            rating=data.get('rating', 0.0),
            available_24x7=bool(data.get('available_24x7', False)),
            mental_health_services=bool(data.get('mental_health_services', True))
        )
        db.session.add(hospital)
        db.session.commit()
        return jsonify({'hospital': hospital.to_dict()}), 201
    except Exception as e:
        logger.error(f"Admin create hospital error: {str(e)}")
        return jsonify({'error': 'Failed to create hospital'}), 500


@admin_bp.route('/hospitals/<int:hospital_id>', methods=['PATCH'])
@admin_required
def update_hospital(hospital_id):
    try:
        hospital = Hospital.query.get(hospital_id)
        if not hospital:
            return jsonify({'error': 'Hospital not found'}), 404

        data = request.get_json() or {}
        for field in ['name', 'address', 'lat', 'lng', 'contact', 'rating', 'available_24x7', 'mental_health_services']:
            if field in data:
                setattr(hospital, field, data[field])

        db.session.commit()
        return jsonify({'hospital': hospital.to_dict()}), 200
    except Exception as e:
        logger.error(f"Admin update hospital error: {str(e)}")
        return jsonify({'error': 'Failed to update hospital'}), 500


@admin_bp.route('/hospitals/<int:hospital_id>', methods=['DELETE'])
@admin_required
def delete_hospital(hospital_id):
    try:
        hospital = Hospital.query.get(hospital_id)
        if not hospital:
            return jsonify({'error': 'Hospital not found'}), 404

        db.session.delete(hospital)
        db.session.commit()
        return jsonify({'message': 'Hospital deleted successfully'}), 200
    except Exception as e:
        logger.error(f"Admin delete hospital error: {str(e)}")
        return jsonify({'error': 'Failed to delete hospital'}), 500


@admin_bp.route('/doctors', methods=['GET'])
@admin_required
def get_admin_doctors():
    try:
        doctors = Doctor.query.order_by(Doctor.name.asc()).all()
        return jsonify({'doctors': [d.to_dict() for d in doctors]}), 200
    except Exception as e:
        logger.error(f"Admin get doctors error: {str(e)}")
        return jsonify({'error': 'Failed to fetch doctors'}), 500


@admin_bp.route('/doctors', methods=['POST'])
@admin_required
def create_doctor():
    try:
        data = request.get_json() or {}
        if not data.get('name') or not data.get('specialization') or not data.get('hospital_id'):
            return jsonify({'error': 'Hospital ID, name, and specialization are required'}), 400

        hospital = Hospital.query.get(data['hospital_id'])
        if not hospital:
            return jsonify({'error': 'Hospital not found'}), 404

        doctor = Doctor(
            hospital_id=data['hospital_id'],
            name=data['name'],
            specialization=data['specialization'],
            qualification=data.get('qualification'),
            experience=data.get('experience', 0),
            timing=data.get('timing'),
            fees=data.get('fees', 0.0),
            available=bool(data.get('available', True)),
            phone=data.get('phone')
        )
        db.session.add(doctor)
        db.session.commit()
        return jsonify({'doctor': doctor.to_dict()}), 201
    except Exception as e:
        logger.error(f"Admin create doctor error: {str(e)}")
        return jsonify({'error': 'Failed to create doctor'}), 500


@admin_bp.route('/doctors/<int:doctor_id>', methods=['PATCH'])
@admin_required
def update_doctor(doctor_id):
    try:
        doctor = Doctor.query.get(doctor_id)
        if not doctor:
            return jsonify({'error': 'Doctor not found'}), 404

        data = request.get_json() or {}
        for field in ['name', 'specialization', 'qualification', 'experience', 'timing', 'fees', 'available', 'phone', 'hospital_id']:
            if field in data:
                setattr(doctor, field, data[field])

        db.session.commit()
        return jsonify({'doctor': doctor.to_dict()}), 200
    except Exception as e:
        logger.error(f"Admin update doctor error: {str(e)}")
        return jsonify({'error': 'Failed to update doctor'}), 500


@admin_bp.route('/doctors/<int:doctor_id>', methods=['DELETE'])
@admin_required
def delete_doctor(doctor_id):
    try:
        doctor = Doctor.query.get(doctor_id)
        if not doctor:
            return jsonify({'error': 'Doctor not found'}), 404

        db.session.delete(doctor)
        db.session.commit()
        return jsonify({'message': 'Doctor deleted successfully'}), 200
    except Exception as e:
        logger.error(f"Admin delete doctor error: {str(e)}")
        return jsonify({'error': 'Failed to delete doctor'}), 500


@admin_bp.route('/panic-alerts', methods=['GET'])
@admin_required
def get_panic_alerts():
    try:
        alerts = PanicAlert.query.order_by(PanicAlert.created_at.desc()).all()
        return jsonify({'panic_alerts': [alert.to_dict() for alert in alerts]}), 200
    except Exception as e:
        logger.error(f"Admin get panic alerts error: {str(e)}")
        return jsonify({'error': 'Failed to fetch panic alerts'}), 500


@admin_bp.route('/appointments', methods=['GET'])
@admin_required
def get_appointments():
    try:
        appointments = Appointment.query.order_by(Appointment.created_at.desc()).all()
        return jsonify({'appointments': [appt.to_dict() for appt in appointments]}), 200
    except Exception as e:
        logger.error(f"Admin get appointments error: {str(e)}")
        return jsonify({'error': 'Failed to fetch appointments'}), 500


@admin_bp.route('/appointments/<int:appointment_id>', methods=['PATCH'])
@admin_required
def update_appointment_status(appointment_id):
    try:
        appointment = Appointment.query.get(appointment_id)
        if not appointment:
            return jsonify({'error': 'Appointment not found'}), 404

        data = request.get_json() or {}
        if 'status' in data and data['status'] in ['pending', 'approved', 'cancelled']:
            appointment.status = data['status']
            db.session.commit()
            return jsonify({'appointment': appointment.to_dict()}), 200

        return jsonify({'error': 'Invalid status'}), 400
    except Exception as e:
        logger.error(f"Admin update appointment error: {str(e)}")
        return jsonify({'error': 'Failed to update appointment'}), 500


@admin_bp.route('/chat-logs', methods=['GET'])
@admin_required
def get_chat_logs():
    try:
        logs = ChatLog.query.order_by(ChatLog.created_at.desc()).all()
        return jsonify({'chat_logs': [log.to_dict() for log in logs]}), 200
    except Exception as e:
        logger.error(f"Admin get chat logs error: {str(e)}")
        return jsonify({'error': 'Failed to fetch chat logs'}), 500


@admin_bp.route('/settings', methods=['GET'])
@admin_required
def get_settings():
    try:
        settings = SystemSetting.query.all()
        return jsonify({'settings': [s.to_dict() for s in settings]}), 200
    except Exception as e:
        logger.error(f"Admin get settings error: {str(e)}")
        return jsonify({'error': 'Failed to fetch settings'}), 500


@admin_bp.route('/settings', methods=['PATCH'])
@admin_required
def update_settings():
    try:
        data = request.get_json() or {}
        for key, value in data.items():
            setting = SystemSetting.query.filter_by(key=key).first()
            if setting:
                setting.value = str(value)
            else:
                setting = SystemSetting(key=key, value=str(value))
                db.session.add(setting)

        db.session.commit()
        settings = SystemSetting.query.all()
        return jsonify({'settings': [s.to_dict() for s in settings]}), 200
    except Exception as e:
        logger.error(f"Admin update settings error: {str(e)}")
        return jsonify({'error': 'Failed to update settings'}), 500
