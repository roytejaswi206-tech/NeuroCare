from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.ml.predictor import get_chat_response
from app.utils.logger import logger

chat_bp = Blueprint('chat', __name__, url_prefix='/api/chat')


@chat_bp.route('', methods=['POST'])
@jwt_required()
def chat():
    """Get AI chat response for mental health support"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        message = data.get('message', '').strip()
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Get response from predictor
        response = get_chat_response(message)
        
        logger.info(f"Chat response for user {user_id}: {response.get('type', 'general')}")
        
        return jsonify(response), 200
    
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        return jsonify({'error': 'Chat failed'}), 500


@chat_bp.route('/quick', methods=['GET'])
@jwt_required()
def get_quick_responses():
    """Get quick response options"""
    try:
        quick_responses = {
            'anxiety': "I feel anxious",
            'stressed': "I'm stressed",
            'sad': "I feel sad",
            'panic': "I'm having a panic attack",
            'sleep': "I can't sleep",
            'general': "I want to talk"
        }
        
        return jsonify({'options': quick_responses}), 200
    
    except Exception as e:
        logger.error(f"Get quick responses error: {str(e)}")
        return jsonify({'error': 'Failed to get quick responses'}), 500
