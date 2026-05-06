from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.ai_service import get_ai_response
from app.extensions import db
from app.models.user import User
from app.models.chat_log import ChatLog
from app.utils.logger import logger

chat_bp = Blueprint('chat', __name__, url_prefix='/api/chat')


@chat_bp.route('', methods=['POST'])
@jwt_required()
def chat():
    """Get AI chat response for mental health support"""
    try:
        user_id = get_jwt_identity()
        try:
            user_id = int(user_id)
        except (TypeError, ValueError):
            return jsonify({'error': 'Invalid user identity'}), 401
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        message = data.get('message', '').strip()
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Get response from AI service
        response = get_ai_response(message)

        # Log chat interaction for monitoring
        keywords = [kw for kw in ['panic', 'anxiety', 'suicide'] if kw in message.lower()]
        chat_log = ChatLog(
            user_id=user_id,
            message=message,
            response_type=response.get('type'),
            flagged=bool(keywords),
            keywords=', '.join(keywords)
        )
        db.session.add(chat_log)
        db.session.commit()
        
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
