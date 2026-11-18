import jwt
from datetime import datetime, timezone, timedelta
from functools import wraps
from flask import request, jsonify, current_app
from app.models import Admin

def generate_admin_token(admin):
    now = datetime.now(timezone.utc)
    payload = {
        'sub': str(admin.id),
        'username': admin.username,
        'email': admin.email,
        'exp': int((now + timedelta(days=current_app.config['JWT_EXPIRES_DAYS'])).timestamp()),
        'iat': int(now.timestamp())
    }
    return jwt.encode(payload, current_app.config['JWT_SECRET'], algorithm='HS256')

def decode_admin_token(token):
    try:
        return jwt.decode(token, current_app.config['JWT_SECRET'], algorithms=['HS256'])
    except Exception as e:
        current_app.logger.error(f"JWT decode error: {e}")
        return None

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        token = None
        
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ', 1)[1]
        elif 'admin_token' in request.cookies:
            token = request.cookies.get('admin_token')
            
        if not token:
            return jsonify({'error': 'Unauthorized: Admin authentication token required'}), 401
            
        payload = decode_admin_token(token)
        if not payload:
            return jsonify({'error': 'Unauthorized: Invalid or expired session'}), 401
            
        admin_id = int(payload.get('sub')) if payload.get('sub') else None
        admin = Admin.query.get(admin_id) if admin_id else None
        if not admin:
            return jsonify({'error': 'Unauthorized: Admin user not found'}), 401
            
        # Attach admin to request context
        request.current_admin = admin
        return f(*args, **kwargs)
    return decorated
