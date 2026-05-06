from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.extensions import db
from app.models.appointment import Appointment
from app.models.user import User
from app.models.doctor import Doctor
from app.models.hospital import Hospital
from app.utils.logger import logger
from datetime import datetime

appointments_bp = Blueprint('appointments', __name__, url_prefix='/api/appointments')


def _get_current_user():
    user_id = get_jwt_identity()
    try:
        return int(user_id)
    except (TypeError, ValueError):
        return None


@appointments_bp.route('', methods=['GET'])
@jwt_required()
def list_appointments():
    try:
        user_id = _get_current_user()
        if user_id is None:
            return jsonify({'error': 'Invalid user identity'}), 401

        claims = get_jwt() or {}
        role = claims.get('role')

        if role in ['super_admin', 'admin']:
            appointments = Appointment.query.order_by(Appointment.created_at.desc()).all()
        else:
            appointments = Appointment.query.filter_by(user_id=user_id).order_by(Appointment.created_at.desc()).all()

        return jsonify({
            'appointments': [appt.to_dict() for appt in appointments],
            'count': len(appointments)
        }), 200
    except Exception as e:
        logger.error(f"List appointments error: {str(e)}")
        return jsonify({'error': 'Failed to fetch appointments'}), 500


@appointments_bp.route('', methods=['POST'])
@jwt_required()
def create_appointment():
    try:
        user_id = _get_current_user()
        if user_id is None:
            return jsonify({'error': 'Invalid user identity'}), 401

        data = request.get_json() or {}
        doctor_id = data.get('doctor_id')
        hospital_id = data.get('hospital_id')
        scheduled_for = data.get('scheduled_for')

        if not hospital_id or not scheduled_for:
            return jsonify({'error': 'Hospital ID and scheduled time are required'}), 400

        doctor = None
        if doctor_id:
            doctor = Doctor.query.get(doctor_id)
            if not doctor:
                return jsonify({'error': 'Doctor not found'}), 404

        appointment_time = None
        try:
            appointment_time = datetime.fromisoformat(scheduled_for)
        except Exception:
            return jsonify({'error': 'Invalid scheduled time format'}), 400

        # Validate selected hospital
        hospital = None
        if hospital_id:
            hospital = Hospital.query.get(hospital_id)
            if not hospital:
                return jsonify({'error': 'Hospital not found'}), 404

        appointment_time = None
        try:
            appointment_time = datetime.fromisoformat(scheduled_for)
        except Exception:
            return jsonify({'error': 'Invalid scheduled time format'}), 400

        if appointment_time <= datetime.utcnow():
            return jsonify({'error': 'Appointment time must be in the future'}), 400

        if doctor_id:
            doctor = Doctor.query.get(doctor_id)
            if not doctor:
                return jsonify({'error': 'Doctor not found'}), 404
            if not doctor.available or not doctor.approved:
                return jsonify({'error': 'Doctor is not currently available for booking'}), 409
            if hospital and doctor.hospital_id != hospital_id:
                return jsonify({'error': 'Doctor does not practice at the selected hospital'}), 400
            # Check doctor schedule conflict
            conflict = Appointment.query.filter_by(doctor_id=doctor_id, scheduled_for=appointment_time).first()
            if conflict:
                return jsonify({'error': 'Selected doctor already has an appointment at that time'}), 409

        # Prevent duplicate user bookings at same time
        user_conflict = Appointment.query.filter_by(user_id=user_id, scheduled_for=appointment_time).first()
        if user_conflict:
            return jsonify({'error': 'You already have an appointment scheduled at this time'}), 409

        appointment = Appointment(
            user_id=user_id,
            doctor_id=doctor_id,
            hospital_id=hospital_id,
            scheduled_for=appointment_time,
            status='pending'
        )
        db.session.add(appointment)
        db.session.commit()

        return jsonify({'appointment': appointment.to_dict()}), 201
    except Exception as e:
        logger.error(f"Create appointment error: {str(e)}")
        return jsonify({'error': 'Failed to create appointment'}), 500


@appointments_bp.route('/<int:appointment_id>', methods=['PATCH'])
@jwt_required()
def update_appointment(appointment_id):
    try:
        user_id = _get_current_user()
        if user_id is None:
            return jsonify({'error': 'Invalid user identity'}), 401

        appointment = Appointment.query.get(appointment_id)
        if not appointment:
            return jsonify({'error': 'Appointment not found'}), 404

        claims = get_jwt() or {}
        role = claims.get('role')
        data = request.get_json() or {}

        if role in ['super_admin', 'admin']:
            if 'status' in data and data['status'] in ['pending', 'approved', 'cancelled']:
                appointment.status = data['status']
        elif appointment.user_id != user_id:
            return jsonify({'error': 'Not authorized to update this appointment'}), 403
        else:
            if 'status' in data and data['status'] == 'cancelled':
                appointment.status = 'cancelled'
            elif 'status' in data:
                return jsonify({'error': 'Only canceling is allowed for user appointments'}), 403

        if 'scheduled_for' in data:
            try:
                new_schedule = datetime.fromisoformat(data['scheduled_for'])
            except Exception:
                return jsonify({'error': 'Invalid scheduled time format'}), 400

            if new_schedule <= datetime.utcnow():
                return jsonify({'error': 'Appointment time must be in the future'}), 400

            if appointment.doctor_id:
                conflict = Appointment.query.filter(
                    Appointment.doctor_id == appointment.doctor_id,
                    Appointment.id != appointment.id,
                    Appointment.scheduled_for == new_schedule
                ).first()
                if conflict:
                    return jsonify({'error': 'Doctor already has an appointment at the requested time'}), 409

            user_conflict = Appointment.query.filter(
                Appointment.user_id == appointment.user_id,
                Appointment.id != appointment.id,
                Appointment.scheduled_for == new_schedule
            ).first()
            if user_conflict:
                return jsonify({'error': 'You already have another appointment at that time'}), 409

            appointment.scheduled_for = new_schedule

        db.session.commit()
        return jsonify({'appointment': appointment.to_dict()}), 200
    except Exception as e:
        logger.error(f"Update appointment error: {str(e)}")
        return jsonify({'error': 'Failed to update appointment'}), 500
