import os
from pathlib import Path
from flask import Flask, jsonify
from flask_cors import CORS
from app.config import Config
from app.models import db

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Enable CORS for Vite frontend (typically localhost:5173, localhost:3000, or any during dev)
    CORS(app, supports_credentials=True, origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "*"])
    
    # Initialize SQLAlchemy
    db.init_app(app)
    
    # Ensure upload directories exist
    upload_base = Path(app.config['UPLOAD_FOLDER'])
    (upload_base / 'books').mkdir(parents=True, exist_ok=True)
    (upload_base / 'covers').mkdir(parents=True, exist_ok=True)
    
    # Register Blueprints
    from app.routes_public import public_bp
    from app.routes_admin import admin_bp
    
    app.register_blueprint(public_bp)
    app.register_blueprint(admin_bp)
    
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'error': 'Resource not found'}), 404
        
    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({'error': 'Internal server error'}), 500
        
    return app
