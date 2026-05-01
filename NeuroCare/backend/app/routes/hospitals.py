from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.hospital import Hospital
from app.models.doctor import Doctor
from app.utils.logger import logger
import math

hospitals_bp = Blueprint('hospitals', __name__, url_prefix='/api/hospitals')


def calculate_distance(lat1, lng1, lat2, lng2):
    """Calculate distance between two coordinates in kilometers (Haversine formula)"""
    R = 6371  # Earth's radius in kilometers
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lng = math.radians(lng2 - lng1)
    
    a = math.sin(delta_lat / 2) ** 2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lng / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c


@hospitals_bp.route('', methods=['GET'])
@jwt_required()
def get_hospitals():
    """Get nearby hospitals based on user location"""
    try:
        lat = request.args.get('lat', type=float)
        lng = request.args.get('lng', type=float)
        radius = request.args.get('radius', 50, type=float)  # Default 50km radius
        
        if lat is None or lng is None:
            return jsonify({'error': 'Latitude and longitude are required'}), 400
        
        # Get all hospitals
        hospitals = Hospital.query.all()
        
        # Filter by distance
        nearby_hospitals = []
        for hospital in hospitals:
            distance = calculate_distance(lat, lng, hospital.lat, hospital.lng)
            if distance <= radius:
                hospital_data = hospital.to_dict()
                hospital_data['distance'] = round(distance, 2)
                nearby_hospitals.append(hospital_data)
        
        # Sort by distance
        nearby_hospitals.sort(key=lambda x: x['distance'])
        
        return jsonify({
            'hospitals': nearby_hospitals,
            'count': len(nearby_hospitals)
        }), 200
    
    except Exception as e:
        logger.error(f"Get hospitals error: {str(e)}")
        return jsonify({'error': 'Failed to get hospitals'}), 500


@hospitals_bp.route('/<int:hospital_id>', methods=['GET'])
@jwt_required()
def get_hospital(hospital_id):
    """Get specific hospital details"""
    try:
        hospital = Hospital.query.get(hospital_id)
        
        if not hospital:
            return jsonify({'error': 'Hospital not found'}), 404
        
        hospital_data = hospital.to_dict()
        hospital_data['doctors'] = [doc.to_dict() for doc in hospital.doctors]
        
        return jsonify({'hospital': hospital_data}), 200
    
    except Exception as e:
        logger.error(f"Get hospital error: {str(e)}")
        return jsonify({'error': 'Failed to get hospital'}), 500


@hospitals_bp.route('/<int:hospital_id>/doctors', methods=['GET'])
@jwt_required()
def get_hospital_doctors(hospital_id):
    """Get doctors at a specific hospital"""
    try:
        hospital = Hospital.query.get(hospital_id)
        
        if not hospital:
            return jsonify({'error': 'Hospital not found'}), 404
        
        doctors = Doctor.query.filter_by(hospital_id=hospital_id).all()
        
        return jsonify({
            'doctors': [doc.to_dict() for doc in doctors],
            'count': len(doctors)
        }), 200
    
    except Exception as e:
        logger.error(f"Get hospital doctors error: {str(e)}")
        return jsonify({'error': 'Failed to get doctors'}), 500


@hospitals_bp.route('/doctors', methods=['GET'])
@jwt_required()
def get_all_doctors():
    """Get all doctors"""
    try:
        specialization = request.args.get('specialization')
        available = request.args.get('available', type=lambda x: x.lower() == 'true')
        
        query = Doctor.query
        
        if specialization:
            query = query.filter(Doctor.specialization.ilike(f'%{specialization}%'))
        
        if available is not None:
            query = query.filter_by(available=available)
        
        doctors = query.all()
        
        return jsonify({
            'doctors': [doc.to_dict() for doc in doctors],
            'count': len(doctors)
        }), 200
    
    except Exception as e:
        logger.error(f"Get all doctors error: {str(e)}")
        return jsonify({'error': 'Failed to get doctors'}), 500


@hospitals_bp.route('/search', methods=['GET'])
@jwt_required()
def search_hospitals():
    """Search hospitals by name or location"""
    try:
        query = request.args.get('q', '')
        
        if not query:
            return jsonify({'error': 'Search query is required'}), 400
        
        hospitals = Hospital.query.filter(
            Hospital.name.ilike(f'%{query}%')
        ).all()
        
        return jsonify({
            'hospitals': [h.to_dict() for h in hospitals],
            'count': len(hospitals)
        }), 200
    
    except Exception as e:
        logger.error(f"Search hospitals error: {str(e)}")
        return jsonify({'error': 'Failed to search hospitals'}), 500


# Admin routes (can be protected in production)
@hospitals_bp.route('/admin/hospital', methods=['POST'])
def add_hospital():
    """Add a new hospital (admin)"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        name = data.get('name')
        lat = data.get('lat')
        lng = data.get('lng')
        
        if not name or lat is None or lng is None:
            return jsonify({'error': 'Name, latitude, and longitude are required'}), 400
        
        hospital = Hospital(
            name=name,
            address=data.get('address'),
            lat=lat,
            lng=lng,
            contact=data.get('contact'),
            rating=data.get('rating', 0.0),
            available_24x7=data.get('available_24x7', False),
            mental_health_services=data.get('mental_health_services', True)
        )
        
        db.session.add(hospital)
        db.session.commit()
        
        logger.info(f"Hospital added: {name}")
        
        return jsonify({
            'message': 'Hospital added successfully',
            'hospital': hospital.to_dict()
        }), 201
    
    except Exception as e:
        logger.error(f"Add hospital error: {str(e)}")
        return jsonify({'error': 'Failed to add hospital'}), 500


@hospitals_bp.route('/admin/doctor', methods=['POST'])
def add_doctor():
    """Add a new doctor (admin)"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        hospital_id = data.get('hospital_id')
        name = data.get('name')
        specialization = data.get('specialization')
        
        if not hospital_id or not name or not specialization:
            return jsonify({'error': 'Hospital ID, name, and specialization are required'}), 400
        
        # Check hospital exists
        hospital = Hospital.query.get(hospital_id)
        if not hospital:
            return jsonify({'error': 'Hospital not found'}), 404
        
        doctor = Doctor(
            hospital_id=hospital_id,
            name=name,
            specialization=specialization,
            qualification=data.get('qualification'),
            experience=data.get('experience', 0),
            timing=data.get('timing'),
            fees=data.get('fees', 0.0),
            available=data.get('available', True),
            phone=data.get('phone')
        )
        
        db.session.add(doctor)
        db.session.commit()
        
        logger.info(f"Doctor added: {name} at {hospital.name}")
        
        return jsonify({
            'message': 'Doctor added successfully',
            'doctor': doctor.to_dict()
        }), 201
    
    except Exception as e:
        logger.error(f"Add doctor error: {str(e)}")
        return jsonify({'error': 'Failed to add doctor'}), 500
