"""
Health Risk Predictor - Rule-based prediction system
Can be upgraded to ML model later
"""

def parse_bp(bp_string):
    """Parse blood pressure string to systolic and diastolic values"""
    if not bp_string:
        return None, None
    try:
        parts = bp_string.split('/')
        return int(parts[0]), int(parts[1])
    except:
        return None, None


def predict_risk(bp=None, sugar=None, sleep=None):
    """
    Predict health risk based on health metrics
    
    Args:
        bp: Blood pressure as string (e.g., "120/80") or tuple (systolic, diastolic)
        sugar: Blood sugar level (mg/dL)
        sleep: Sleep hours
    
    Returns:
        dict with risk level, confidence, and suggestions
    """
    risk_score = 0
    max_score = 100
    risk_factors = []
    suggestions = []
    
    # Parse blood pressure
    systolic, diastolic = None, None
    if isinstance(bp, str):
        systolic, diastolic = parse_bp(bp)
    elif isinstance(bp, tuple):
        systolic, diastolic = bp
    
    # Blood pressure analysis
    if systolic and diastolic:
        if systolic >= 180 or diastolic >= 120:
            risk_score += 40
            risk_factors.append("Critical high blood pressure")
            suggestions.append("Seek immediate medical attention for hypertensive crisis")
        elif systolic >= 140 or diastolic >= 90:
            risk_score += 30
            risk_factors.append("High blood pressure (Stage 2)")
            suggestions.append("Consult a cardiologist within 24 hours")
            suggestions.append("Reduce sodium intake and avoid alcohol")
        elif systolic >= 130 or diastolic >= 80:
            risk_score += 20
            risk_factors.append("Elevated blood pressure (Stage 1)")
            suggestions.append("Monitor BP daily")
            suggestions.append("Exercise for 30 minutes daily")
        else:
            suggestions.append("Maintain healthy blood pressure with regular exercise")
    
    # Blood sugar analysis
    if sugar:
        if sugar >= 400:
            risk_score += 35
            risk_factors.append("Very high blood sugar (diabetic emergency)")
            suggestions.append("Seek immediate medical attention")
        elif sugar >= 250:
            risk_score += 25
            risk_factors.append("High blood sugar")
            suggestions.append("Check for ketones")
            suggestions.append("Stay hydrated")
        elif sugar >= 140:
            risk_score += 15
            risk_factors.append("Elevated blood sugar")
            suggestions.append("Reduce sugar intake")
            suggestions.append("Increase physical activity")
        elif sugar < 70:
            risk_score += 20
            risk_factors.append("Low blood sugar")
            suggestions.append("Eat a quick carbohydrate snack")
            suggestions.append("Consult doctor if frequent")
        else:
            suggestions.append("Maintain healthy blood sugar levels")
    
    # Sleep analysis
    if sleep is not None:
        if sleep < 4:
            risk_score += 25
            risk_factors.append("Severe sleep deprivation")
            suggestions.append("Prioritize sleep - aim for 7-9 hours")
            suggestions.append("Consult a sleep specialist")
        elif sleep < 6:
            risk_score += 15
            risk_factors.append("Insufficient sleep")
            suggestions.append("Try to get at least 7 hours of sleep")
            suggestions.append("Avoid screens before bed")
        elif sleep > 10:
            risk_score += 10
            risk_factors.append("Oversleeping may indicate health issues")
            suggestions.append("Maintain consistent sleep schedule")
        else:
            suggestions.append("Great job maintaining healthy sleep!")
    
    # Calculate risk level
    if risk_score == 0:
        risk_level = "Low"
        confidence = 0.95
        suggestions.insert(0, "Your health metrics look good! Keep up the healthy lifestyle.")
    elif risk_score <= 25:
        risk_level = "Low"
        confidence = 0.85
        if not suggestions:
            suggestions.append("Your health metrics are within acceptable range.")
    elif risk_score <= 50:
        risk_level = "Moderate"
        confidence = 0.75
    elif risk_score <= 75:
        risk_level = "High"
        confidence = 0.70
    else:
        risk_level = "Critical"
        confidence = 0.85
    
    return {
        'risk': risk_level,
        'confidence': confidence,
        'risk_score': min(risk_score, max_score),
        'risk_factors': risk_factors if risk_factors else ["No significant risk factors detected"],
        'suggestions': suggestions if suggestions else ["Continue maintaining a healthy lifestyle"],
        'metrics': {
            'bp': f"{systolic}/{diastolic}" if systolic and diastolic else bp,
            'sugar': sugar,
            'sleep': sleep
        }
    }


def get_chat_response(message):
    """
    Generate supportive responses for mental health chat
    
    Args:
        message: User's message
    
    Returns:
        dict with response and suggestions
    """
    message_lower = message.lower()
    
    # Define keyword lists
    panic_keywords = ['panic', 'panic attack']
    anxiety_keywords = ['anxious', 'anxiety', 'worried', 'worry', 'nervous', 'fear', 'scared']
    depression_keywords = ['sad', 'depressed', 'depression', 'hopeless', 'empty', 'lonely']
    stress_keywords = ['stress', 'stressed', 'overwhelmed', 'pressure', 'burnout']
    sleep_keywords = ['sleep', 'insomnia', 'cannot sleep', 'exhausted']
    
    # Check for panic first
    for keyword in panic_keywords:
        if keyword in message_lower:
            return {
                'response': "I understand you're experiencing a panic attack. Let's take a moment together. First, I want you to know: You are safe right now. Let's try the 4-4-4 breathing: Breathe in for 4 seconds, hold for 4 seconds, breathe out for 4 seconds. Continue this pattern. With each breath, say to yourself: 'I am safe. This will pass.'",
                'type': 'panic_support',
                'suggestions': [
                    "Look around and name 5 things you can see, 4 things you can touch, 3 things you can hear.",
                    "Remember: Panic attacks are not dangerous. They pass. You are stronger than you think.",
                    "Would you like me to guide you through a grounding exercise?"
                ],
                'resources': {
                    'helpline': '988 (Suicide & Crisis Lifeline)',
                    'crisis_text': 'Text HOME to 741741'
                }
            }
    
    # Check for anxiety
    for keyword in anxiety_keywords:
        if keyword in message_lower:
            return {
                'response': "I hear you. Anxiety can feel overwhelming, but there are ways to manage it. First, let's take a few deep breaths together. Inhale... Exhale... It's okay to feel anxious. It's a normal human emotion. What matters is how we respond.",
                'type': 'anxiety_support',
                'suggestions': [
                    "Box breathing: 4 seconds in, 4 hold, 4 out, 4 hold",
                    "Write down your worries and challenge them",
                    "Practice Mindfulness for just 2 minutes a day"
                ],
                'exercise': 'box_breathing'
            }
    
    # Check for depression
    for keyword in depression_keywords:
        if keyword in message_lower:
            return {
                'response': "I'm here with you. What you're feeling is valid, and you don't have to face this alone. Depression can make everything feel heavy, but small steps can help. Have you been able to do any small activities today?",
                'type': 'depression_support',
                'suggestions': [
                    "Talk to someone you trust",
                    "Set one small goal for today",
                    "Get some sunlight if possible",
                    "Reach out to a mental health professional"
                ]
            }
    
    # Check for stress
    for keyword in stress_keywords:
        if keyword in message_lower:
            return {
                'response': "Stress can feel overwhelming. Let's work through this together. Take a moment to identify what's within your control and what isn't.",
                'type': 'stress_support',
                'suggestions': [
                    "Make a list of stressors and rank them",
                    "Take breaks throughout your day",
                    "Practice gratitude - write 3 things you're grateful for",
                    "Connect with supportive people"
                ]
            }
    
    # Check for sleep issues
    for keyword in sleep_keywords:
        if keyword in message_lower:
            return {
                'response': "I hear you. Sleep difficulties are common and can affect our mental health. Sleep is crucial for mental health. Let's work on getting you better rest.",
                'type': 'sleep_support',
                'suggestions': [
                    "Keep a consistent sleep schedule",
                    "Avoid screens 1 hour before bed",
                    "Create a cool, dark environment",
                    "Avoid caffeine after 2 PM",
                    "Try relaxation exercises before sleep"
                ]
            }
    
    # Default supportive response
    return {
        'response': "Thank you for sharing that with me. I'm here to support you. I'm here to listen without judgment. Would you like to talk more about how you're feeling?",
        'type': 'general',
        'suggestions': [
            "I'm here to listen without judgment.",
            "Would you like to talk more about how you're feeling?",
            "If you'd like, I can suggest some resources or techniques that might help."
        ]
    }
