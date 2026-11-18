from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class Admin(db.Model):
    __tablename__ = 'admins'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
        
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    slug = db.Column(db.String(120), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    icon = db.Column(db.String(50), default='BookOpen')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    books = db.relationship('Book', back_populates='category', cascade='all, delete-orphan')
    
    def to_dict(self, include_counts=True):
        data = {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'icon': self.icon,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        if include_counts:
            data['book_count'] = len([b for b in self.books if b.is_published])
        return data

class Book(db.Model):
    __tablename__ = 'books'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(280), unique=True, nullable=False)
    author = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    category = db.relationship('Category', back_populates='books')
    
    cover_url = db.Column(db.String(500), nullable=True)
    file_type = db.Column(db.String(20), default='pdf') # 'pdf' or 'epub'
    file_url = db.Column(db.String(500), nullable=False)
    file_size = db.Column(db.String(50), default='1.2 MB')
    page_count = db.Column(db.Integer, default=1)
    
    language = db.Column(db.String(50), default='English')
    published_year = db.Column(db.Integer, nullable=True)
    
    is_featured = db.Column(db.Boolean, default=False)
    is_published = db.Column(db.Boolean, default=True)
    
    # Copyright & Legal Verification
    copyright_status = db.Column(db.String(50), default='public_domain') # public_domain, creative_commons, author_permission
    license_name = db.Column(db.String(100), default='Public Domain Mark 1.0')
    copyright_notes = db.Column(db.Text, nullable=True)
    
    view_count = db.Column(db.Integer, default=0)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self, full=False):
        data = {
            'id': self.id,
            'title': self.title,
            'slug': self.slug,
            'author': self.author,
            'description': self.description,
            'category_id': self.category_id,
            'category_name': self.category.name if self.category else None,
            'category_slug': self.category.slug if self.category else None,
            'cover_url': self.cover_url,
            'file_type': self.file_type,
            'file_url': self.file_url,
            'file_size': self.file_size,
            'page_count': self.page_count,
            'language': self.language,
            'published_year': self.published_year,
            'is_featured': self.is_featured,
            'is_published': self.is_published,
            'copyright_status': self.copyright_status,
            'license_name': self.license_name,
            'view_count': self.view_count,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
        if full:
            data['copyright_notes'] = self.copyright_notes
            data['updated_at'] = self.updated_at.isoformat() if self.updated_at else None
        return data

class AdConfig(db.Model):
    __tablename__ = 'ad_configs'
    
    id = db.Column(db.Integer, primary_key=True)
    slot_key = db.Column(db.String(50), unique=True, nullable=False)
    slot_name = db.Column(db.String(100), nullable=False)
    is_enabled = db.Column(db.Boolean, default=True)
    ad_client_id = db.Column(db.String(100), default='ca-pub-XXXXXXXXXXXX')
    ad_slot_id = db.Column(db.String(100), default='1234567890')
    custom_html = db.Column(db.Text, nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'slot_key': self.slot_key,
            'slot_name': self.slot_name,
            'is_enabled': self.is_enabled,
            'ad_client_id': self.ad_client_id,
            'ad_slot_id': self.ad_slot_id,
            'custom_html': self.custom_html,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class SiteSetting(db.Model):
    __tablename__ = 'site_settings'
    
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(100), unique=True, nullable=False)
    value = db.Column(db.Text, nullable=True)
    description = db.Column(db.String(255), nullable=True)
    
    def to_dict(self):
        return {
            'key': self.key,
            'value': self.value,
            'description': self.description
        }

class CopyrightReport(db.Model):
    __tablename__ = 'copyright_reports'
    
    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=True)
    book_title = db.Column(db.String(255), nullable=True)
    reporter_name = db.Column(db.String(120), nullable=False)
    reporter_email = db.Column(db.String(120), nullable=False)
    reason = db.Column(db.String(150), nullable=False)
    details = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(30), default='pending') # pending, reviewed, resolved
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'book_id': self.book_id,
            'book_title': self.book_title,
            'reporter_name': self.reporter_name,
            'reporter_email': self.reporter_email,
            'reason': self.reason,
            'details': self.details,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
