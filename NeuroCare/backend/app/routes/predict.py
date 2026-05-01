from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.ml.predictor import predict_risk
from app.utils.validators import validate_bp, validate_sugar, validate_sleep
from app.utils.logger import logger

predict_bp = Blueprint('predict', __name__, url_prefix='/api/predict')


@predict_bp.route('', methods=['POST'])
@jwt_required()
def predict():
    """Predict health risk based on input metrics"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        bp = data.get('bp')
        sugar = data.get('sugar')
        sleep = data.get('sleep')
        
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
        
        # Get prediction
        result = predict_risk(bp=bp, sugar=sugar, sleep=sleep)
        
        logger.info(f"Prediction made for user {user_id}: {result['risk']}")
        
        return jsonify(result), 200
    
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({'error': 'Prediction failed'}), 500


@predict_bp.route('/history', methods=['GET'])
@jwt_required()
def get_prediction_history():
    """Get prediction history (placeholder - can be extended)"""
    try:
        return jsonify({
            'predictions': [],
            'message': 'Prediction history feature coming soon'
        }), 200
    
    except Exception as e:
        logger.error(f"Get prediction history error: {str(e)}")
        return jsonify({'error': 'Failed to get prediction history'}), 500
