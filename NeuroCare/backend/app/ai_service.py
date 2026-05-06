import os
import json

from app.utils.logger import logger
from app.ml.predictor import get_chat_response as fallback_chat_response

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
model = None

if GEMINI_API_KEY:
    try:
        import google.generativeai as genai

        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-pro")
        logger.info("Gemini AI configured successfully")
    except Exception as e:
        logger.error(f"Failed to configure Gemini AI: {str(e)}")
        model = None
else:
    logger.warning("GEMINI_API_KEY is not configured. Falling back to rule-based chat.")


def parse_gemini_response(response):
    if response is None:
        return None

    text = None
    if hasattr(response, 'text'):
        text = response.text
    elif isinstance(response, str):
        text = response
    else:
        try:
            text = str(response)
        except Exception:
            text = None

    if text is None:
        return None

    text = text.strip()
    if text.startswith('{') and text.endswith('}'):
        try:
            payload = json.loads(text)
            return payload
        except json.JSONDecodeError:
            logger.warning('Gemini response could not be parsed as JSON. Using raw text.')

    return {'response': text}


def get_ai_response(message):
    if not message:
        return fallback_chat_response(message)

    if model is None:
        return fallback_chat_response(message)

    prompt = f"""
You are a compassionate, empathetic mental health assistant.
User says: "{message}"
Respond with a calm, supportive, and practical answer.
If possible, return a JSON object with the following keys:
- response: the assistant's message text
- type: a short tag like anxiety_support, panic_support, depression_support, sleep_support, or general
- suggestions: an array of short supportive suggestions
- resources: optional crisis support information with keys like helpline and crisis_text

If you cannot return valid JSON, simply return a thoughtful supportive response.
"""

    try:
        gemini_response = model.generate_content(prompt)
        parsed = parse_gemini_response(gemini_response)

        if isinstance(parsed, dict) and parsed.get('response'):
            return {
                'response': parsed.get('response'),
                'type': parsed.get('type', 'gemini_support'),
                'suggestions': parsed.get('suggestions', []),
                'resources': parsed.get('resources', {}),
            }

        text = parsed.get('response') if isinstance(parsed, dict) else str(parsed)
        return {
            'response': text or "I'm here to support you. Can you tell me more?",
            'type': 'gemini_support',
            'suggestions': [],
            'resources': {},
        }
    except Exception as e:
        logger.error(f"Gemini AI error: {str(e)}")
        return fallback_chat_response(message)
