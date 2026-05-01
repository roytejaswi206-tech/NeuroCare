from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.health_data import HealthData
from app.utils.validators import validate_bp, validate_sugar, validate_sleep
from app.utils.logger import logger

health_bp = Blueprint('health', __name__, url_prefix='/api/health')


@health_bp.route('/data', methods=['POST'])
@jwt_required()
def add_health_data():
    """Add health data entry for current user"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        bp = data.get('bp', '')
        sugar = data.get('sugar')
        sleep = data.get('sleep')
        heart_rate = data.get('heart_rate')
        weight = data.get('weight')
        mood = data.get('mood')
        
        # Validate inputs
        if bp:
            valid, error = validate_bp(bp)
            if not valid:
                return jsonify({'error': error}), 400
        
        if sugar is not None:
            valid, error = validate_sugar(sugar)
            if not valid:
                return jsonify({'error': error}), 400
        
        if sleep is not None:
            valid, error = validate_sleep(sleep)
            if not valid:
                return jsonify({'error': error}), 400
        
        # Create health data entry
        new_health_data = HealthData(
            user_id=user_id,
            bp=bp,
            sugar=sugar,
            sleep=sleep,
            heart_rate=heart_rate,
            weight=weight,
            mood=mood
        )
        db.session.add(new_health_data)
        db.session.commit()
        
        logger.info(f"Health data added for user {user_id}")
        
        return jsonify({
            'message': 'Health data added successfully',
            'data': new_health_data.to_dict()
        }), 201
    
    except Exception as e:
        logger.error(f"Add health data error: {str(e)}")
        return jsonify({'error': 'Failed to add health data'}), 500


@health_bp.route('/data', methods=['GET'])
@jwt_required()
def get_health_data():
    """Get health data for current user"""
    try:
        user_id = get_jwt_identity()
        limit = request.args.get('limit', 30, type=int)
        offset = request.args.get('offset', 0, type=int)
        
        health_data = HealthData.query.filter_by(user_id=user_id).order_by(
            HealthData.created_at.desc()
        ).limit(limit).offset(offset).all()
        
        return jsonify({
            'data': [hd.to_dict() for hd in health_data],
            'count': len(health_data)
        }), 200
    
    except Exception as e:
        logger.error(f"Get health data error: {str(e)}")
        return jsonify({'error': 'Failed to get health data'}), 500


@health_bp.route('/data/<int:data_id>', methods=['DELETE'])
@jwt_required()
def delete_health_data(data_id):
    """Delete a health data entry"""
    try:
        user_id = get_jwt_identity()
        health_data = HealthData.query.filter_by(id=data_id, user_id=user_id).first()
        
        if not health_data:
            return jsonify({'error': 'Health data not found'}), 404
        
        db.session.delete(health_data)
        db.session.commit()
        
        logger.info(f"Health data {data_id} deleted for user {user_id}")
        
        return jsonify({'message': 'Health data deleted successfully'}), 200
    
    except Exception as e:
        logger.error(f"Delete health data error: {str(e)}")
        return jsonify({'error': 'Failed to delete health data'}), 500


@health_bp.route('/data/latest', methods=['GET'])
@jwt_required()
def get_latest_health_data():
    """Get latest health data entry"""
    try:
        user_id = get_jwt_identity()
        health_data = HealthData.query.filter_by(user_id=user_id).order_by(
            HealthData.created_at.desc()
        ).first()
        
        if not health_data:
            return jsonify({'error': 'No health data found'}), 404
        
        return jsonify({'data': health_data.to_dict()}), 200
    
    except Exception as e:
        logger.error(f"Get latest health data error: {str(e)}")
        return jsonify({'error': 'Failed to get health data'}), 500


@health_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_health_stats():
    """Get health statistics for current user"""
    try:
        user_id = get_jwt_identity()
        health_data = HealthData.query.filter_by(user_id=user_id).order_by(
            HealthData.created_at.desc()
        ).limit(30).all()
        
        if not health_data:
            return jsonify({'stats': None}), 200
        
        # Calculate averages
        bp_values = []
        sugar_values = []
        sleep_values = []
        
        for hd in health_data:
            if hd.bp:
                try:
                    parts = hd.bp.split('/')
                    bp_values.append(int(parts[0]))
                except:
                    pass
            if hd.sugar:
                sugar_values.append(hd.sugar)
            if hd.sleep is not None:
                sleep_values.append(hd.sleep)
        
        stats = {
            'avg_bp': sum(bp_values) / len(bp_values) if bp_values else None,
            'avg_sugar': sum(sugar_values) / len(sugar_values) if sugar_values else None,
            'avg_sleep': sum(sleep_values) / len(sleep_values) if sleep_values else None,
            'total_entries': len(health_data)
        }
        
        return jsonify({'stats': stats}), 200
    
    except Exception as e:
        logger.error(f"Get health stats error: {str(e)}")
        return jsonify({'error': 'Failed to get health stats'}), 500
