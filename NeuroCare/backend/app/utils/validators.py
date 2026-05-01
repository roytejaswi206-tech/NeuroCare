import re

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 6:
        return False, "Password must be at least 6 characters"
    return True, None

def validate_bp(bp_string):
    """Validate blood pressure format (systolic/diastolic)"""
    if not bp_string:
        return True, None
    pattern = r'^\d{2,3}/\d{2,3}$'
    if not re.match(pattern, bp_string):
        return False, "Blood pressure must be in format systolic/diastolic (e.g., 120/80)"
    parts = bp_string.split('/')
    systolic = int(parts[0])
    diastolic = int(parts[1])
    if systolic < 60 or systolic > 250:
        return False, "Systolic pressure must be between 60 and 250"
    if diastolic < 40 or diastolic > 150:
        return False, "Diastolic pressure must be between 40 and 150"
    return True, None

def validate_sugar(level):
    """Validate blood sugar level"""
    if level is None:
        return True, None
    if not isinstance(level, int):
        try:
            level = int(level)
        except ValueError:
            return False, "Blood sugar must be a number"
    if level < 20 or level > 600:
        return False, "Blood sugar must be between 20 and 600 mg/dL"
    return True, None

def validate_sleep(hours):
    """Validate sleep hours"""
    if hours is None:
        return True, None
    if not isinstance(hours, (int, float)):
        return False, "Sleep hours must be a number"
    if hours < 0 or hours > 24:
        return False, "Sleep hours must be between 0 and 24"
    return True, None
