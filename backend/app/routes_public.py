import os
from pathlib import Path
from flask import Blueprint, request, jsonify, current_app, send_from_directory, abort
from sqlalchemy import or_
from app.models import db, Book, Category, AdConfig, SiteSetting, CopyrightReport

public_bp = Blueprint('public', __name__, url_prefix='/api')

@public_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'eBook Digital Library API'})

@public_bp.route('/books', methods=['GET'])
def list_books():
    query_param = request.args.get('q', '').strip()
    category_slug = request.args.get('category', '').strip()
    license_status = request.args.get('license', '').strip()
    sort_by = request.args.get('sort', 'recent') # recent, popular, title_asc, title_desc
    page = max(1, int(request.args.get('page', 1)))
    limit = min(50, max(1, int(request.args.get('limit', 12))))
    
    # Base query: Only published books
    query = Book.query.filter_by(is_published=True)
    
    # Category filter
    if category_slug:
        query = query.join(Category).filter(Category.slug == category_slug)
        
    # License status filter
    if license_status:
        query = query.filter(Book.copyright_status == license_status)
        
    # Text search
    if query_param:
        term = f"%{query_param}%"
        query = query.filter(
            or_(
                Book.title.ilike(term),
                Book.author.ilike(term),
                Book.description.ilike(term)
            )
        )
        
    # Sorting
    if sort_by == 'popular':
        query = query.order_by(Book.view_count.desc())
    elif sort_by == 'title_asc':
        query = query.order_by(Book.title.asc())
    elif sort_by == 'title_desc':
        query = query.order_by(Book.title.desc())
    else: # recent default
        query = query.order_by(Book.created_at.desc())
        
    total_count = query.count()
    total_pages = (total_count + limit - 1) // limit
    books = query.offset((page - 1) * limit).limit(limit).all()
    
    return jsonify({
        'books': [b.to_dict() for b in books],
        'pagination': {
            'page': page,
            'limit': limit,
            'total_items': total_count,
            'total_pages': total_pages
        }
    })

@public_bp.route('/books/featured', methods=['GET'])
def featured_books():
    books = Book.query.filter_by(is_published=True, is_featured=True).order_by(Book.view_count.desc()).limit(8).all()
    # Fallback to recent if not enough featured
    if len(books) < 4:
        additional = Book.query.filter_by(is_published=True).filter(~Book.id.in_([b.id for b in books])).order_by(Book.created_at.desc()).limit(8 - len(books)).all()
        books.extend(additional)
    return jsonify({'books': [b.to_dict() for b in books]})

@public_bp.route('/books/recent', methods=['GET'])
def recent_books():
    books = Book.query.filter_by(is_published=True).order_by(Book.created_at.desc()).limit(8).all()
    return jsonify({'books': [b.to_dict() for b in books]})

@public_bp.route('/books/<identifier>', methods=['GET'])
def get_book(identifier):
    book = None
    if identifier.isdigit():
        book = Book.query.filter_by(id=int(identifier), is_published=True).first()
    if not book:
        book = Book.query.filter_by(slug=identifier, is_published=True).first()
        
    if not book:
        return jsonify({'error': 'Book not found'}), 404
        
    # Increment view count
    try:
        book.view_count += 1
        db.session.commit()
    except Exception:
        db.session.rollback()
        
    # Related books from the same category
    related = Book.query.filter(
        Book.is_published == True,
        Book.category_id == book.category_id,
        Book.id != book.id
    ).order_by(Book.view_count.desc()).limit(4).all()
    
    book_data = book.to_dict(full=True)
    book_data['related_books'] = [r.to_dict() for r in related]
    return jsonify({'book': book_data})

@public_bp.route('/categories', methods=['GET'])
def list_categories():
    categories = Category.query.order_by(Category.name.asc()).all()
    return jsonify({'categories': [c.to_dict(include_counts=True) for c in categories]})

@public_bp.route('/categories/<slug>', methods=['GET'])
def get_category(slug):
    category = Category.query.filter_by(slug=slug).first_or_404()
    books = Book.query.filter_by(category_id=category.id, is_published=True).order_by(Book.created_at.desc()).all()
    return jsonify({
        'category': category.to_dict(),
        'books': [b.to_dict() for b in books]
    })

@public_bp.route('/ads', methods=['GET'])
def get_active_ads():
    """
    Returns public ad slot configs for the public website.
    Reading interface will never query or use ads.
    """
    ads = AdConfig.query.filter_by(is_enabled=True).all()
    return jsonify({'ads': {a.slot_key: a.to_dict() for a in ads}})

@public_bp.route('/settings', methods=['GET'])
def get_public_settings():
    settings = SiteSetting.query.all()
    settings_dict = {s.key: s.value for s in settings}
    return jsonify({'settings': settings_dict})

@public_bp.route('/copyright-report', methods=['POST'])
def submit_copyright_report():
    data = request.get_json() or {}
    name = data.get('reporter_name', '').strip()
    email = data.get('reporter_email', '').strip()
    reason = data.get('reason', '').strip()
    details = data.get('details', '').strip()
    book_id = data.get('book_id')
    book_title = data.get('book_title')
    
    if not name or not email or not reason or not details:
        return jsonify({'error': 'Name, email, reason, and detailed description are required'}), 400
        
    report = CopyrightReport(
        book_id=book_id,
        book_title=book_title,
        reporter_name=name,
        reporter_email=email,
        reason=reason,
        details=details,
        status='pending'
    )
    db.session.add(report)
    db.session.commit()
    
    return jsonify({
        'message': 'Your report has been submitted. Our compliance team will review it promptly.',
        'report_id': report.id
    }), 201

@public_bp.route('/uploads/<subfolder>/<filename>', methods=['GET'])
def serve_upload(subfolder, filename):
    if subfolder not in ['books', 'covers']:
        abort(403)
    upload_root = Path(current_app.config['UPLOAD_FOLDER']) / subfolder
    if not (upload_root / filename).is_file():
        abort(404)
    return send_from_directory(str(upload_root), filename)
