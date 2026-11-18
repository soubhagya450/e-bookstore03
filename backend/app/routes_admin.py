import re
from flask import Blueprint, request, jsonify, current_app
from app.models import db, Admin, Book, Category, AdConfig, SiteSetting, CopyrightReport
from app.auth import generate_admin_token, admin_required
from app.storage import StorageManager, allowed_file

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-')

# ================= AUTHENTICATION =================

@admin_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    username_or_email = data.get('username', '').strip()
    password = data.get('password', '')
    
    if not username_or_email or not password:
        return jsonify({'error': 'Username and password are required'}), 400
        
    admin = Admin.query.filter(
        (Admin.username == username_or_email) | (Admin.email == username_or_email)
    ).first()
    
    if not admin or not admin.check_password(password):
        return jsonify({'error': 'Invalid credentials. Please verify your admin username and password.'}), 401
        
    token = generate_admin_token(admin)
    
    response = jsonify({
        'message': 'Login successful',
        'token': token,
        'admin': admin.to_dict()
    })
    response.set_cookie('admin_token', token, httponly=True, samesite='Lax', max_age=7*24*3600)
    return response

@admin_bp.route('/me', methods=['GET'])
@admin_required
def get_current_admin():
    return jsonify({'admin': request.current_admin.to_dict()})

@admin_bp.route('/logout', methods=['POST'])
def logout():
    response = jsonify({'message': 'Logged out successfully'})
    response.delete_cookie('admin_token')
    return response

@admin_bp.route('/profile', methods=['PUT'])
@admin_required
def update_profile():
    admin = request.current_admin
    data = request.get_json() or {}
    
    new_username = data.get('username', '').strip()
    new_email = data.get('email', '').strip()
    current_password = data.get('current_password', '')
    new_password = data.get('new_password', '')
    
    if new_username:
        # Check uniqueness
        existing = Admin.query.filter(Admin.username == new_username, Admin.id != admin.id).first()
        if existing:
            return jsonify({'error': 'Username already taken'}), 400
        admin.username = new_username
        
    if new_email:
        existing = Admin.query.filter(Admin.email == new_email, Admin.id != admin.id).first()
        if existing:
            return jsonify({'error': 'Email already in use'}), 400
        admin.email = new_email
        
    if new_password:
        if not current_password or not admin.check_password(current_password):
            return jsonify({'error': 'Current password incorrect'}), 400
        if len(new_password) < 6:
            return jsonify({'error': 'New password must be at least 6 characters'}), 400
        admin.set_password(new_password)
        
    db.session.commit()
    return jsonify({'message': 'Profile updated successfully', 'admin': admin.to_dict()})

# ================= DASHBOARD STATS =================

@admin_bp.route('/stats', methods=['GET'])
@admin_required
def get_stats():
    total_books = Book.query.count()
    published_books = Book.query.filter_by(is_published=True).count()
    draft_books = total_books - published_books
    total_categories = Category.query.count()
    total_views = db.session.query(db.func.sum(Book.view_count)).scalar() or 0
    pending_reports = CopyrightReport.query.filter_by(status='pending').count()
    featured_books = Book.query.filter_by(is_featured=True).count()
    
    recent_books = Book.query.order_by(Book.created_at.desc()).limit(5).all()
    recent_reports = CopyrightReport.query.order_by(CopyrightReport.created_at.desc()).limit(5).all()
    
    return jsonify({
        'stats': {
            'total_books': total_books,
            'published_books': published_books,
            'draft_books': draft_books,
            'total_categories': total_categories,
            'total_views': int(total_views),
            'pending_reports': pending_reports,
            'featured_books': featured_books
        },
        'recent_books': [b.to_dict() for b in recent_books],
        'recent_reports': [r.to_dict() for r in recent_reports]
    })

# ================= BOOK MANAGEMENT =================

@admin_bp.route('/books', methods=['GET'])
@admin_required
def admin_list_books():
    query_param = request.args.get('q', '').strip()
    status_filter = request.args.get('status', 'all')
    category_id = request.args.get('category_id')
    page = max(1, int(request.args.get('page', 1)))
    limit = min(100, max(1, int(request.args.get('limit', 20))))
    
    query = Book.query
    
    if status_filter == 'published':
        query = query.filter_by(is_published=True)
    elif status_filter == 'draft':
        query = query.filter_by(is_published=False)
    elif status_filter == 'featured':
        query = query.filter_by(is_featured=True)
        
    if category_id:
        query = query.filter_by(category_id=int(category_id))
        
    if query_param:
        term = f"%{query_param}%"
        query = query.filter(
            (Book.title.ilike(term)) | (Book.author.ilike(term))
        )
        
    query = query.order_by(Book.created_at.desc())
    total_count = query.count()
    books = query.offset((page - 1) * limit).limit(limit).all()
    
    return jsonify({
        'books': [b.to_dict(full=True) for b in books],
        'pagination': {
            'page': page,
            'limit': limit,
            'total_items': total_count,
            'total_pages': (total_count + limit - 1) // limit
        }
    })

@admin_bp.route('/books', methods=['POST'])
@admin_required
def create_book():
    # Supports JSON or multipart/form-data with file upload
    if request.is_json:
        data = request.get_json()
    else:
        data = request.form.to_dict()
        
    title = data.get('title', '').strip()
    author = data.get('author', '').strip()
    category_id = data.get('category_id')
    
    if not title or not author or not category_id:
        return jsonify({'error': 'Title, author, and category are required'}), 400
        
    # Check category existence
    category = Category.query.get(int(category_id))
    if not category:
        return jsonify({'error': 'Selected category does not exist'}), 400
        
    # Unique slug generation
    base_slug = slugify(title)
    slug = base_slug
    counter = 1
    while Book.query.filter_by(slug=slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1
        
    # Handle file uploads if sent via form-data
    file_url = data.get('file_url', '')
    cover_url = data.get('cover_url', '')
    file_type = data.get('file_type', 'pdf').lower()
    file_size = data.get('file_size', '1.0 MB')
    
    if 'book_file' in request.files:
        book_file = request.files['book_file']
        if book_file and book_file.filename and allowed_file(book_file.filename):
            ext = book_file.filename.rsplit('.', 1)[-1].lower()
            file_type = ext
            file_url = StorageManager.save_file(book_file, subfolder="books", custom_prefix=slug[:15])
            
    if 'cover_image' in request.files:
        cover_image = request.files['cover_image']
        if cover_image and cover_image.filename and allowed_file(cover_image.filename):
            cover_url = StorageManager.save_file(cover_image, subfolder="covers", custom_prefix=f"cover_{slug[:15]}")
            
    if not file_url:
        return jsonify({'error': 'Book file (PDF or EPUB) or valid file URL is required'}), 400

    def parse_bool(val, default=True):
        if isinstance(val, bool):
            return val
        if isinstance(val, str):
            return val.lower() in ('true', '1', 'yes')
        return default

    book = Book(
        title=title,
        slug=slug,
        author=author,
        description=data.get('description', ''),
        category_id=int(category_id),
        cover_url=cover_url or None,
        file_type=file_type,
        file_url=file_url,
        file_size=file_size,
        page_count=int(data.get('page_count', 1)),
        language=data.get('language', 'English'),
        published_year=int(data.get('published_year')) if data.get('published_year') else None,
        is_featured=parse_bool(data.get('is_featured'), False),
        is_published=parse_bool(data.get('is_published'), True),
        copyright_status=data.get('copyright_status', 'public_domain'),
        license_name=data.get('license_name', 'Public Domain Mark 1.0'),
        copyright_notes=data.get('copyright_notes', '')
    )
    
    db.session.add(book)
    db.session.commit()
    
    return jsonify({
        'message': 'Book created successfully',
        'book': book.to_dict(full=True)
    }), 201

@admin_bp.route('/books/<int:book_id>', methods=['GET'])
@admin_required
def admin_get_book(book_id):
    book = Book.query.get_or_404(book_id)
    return jsonify({'book': book.to_dict(full=True)})

@admin_bp.route('/books/<int:book_id>', methods=['PUT'])
@admin_required
def update_book(book_id):
    book = Book.query.get_or_404(book_id)
    
    if request.is_json:
        data = request.get_json()
    else:
        data = request.form.to_dict()
        
    if 'title' in data and data['title'].strip():
        book.title = data['title'].strip()
    if 'author' in data and data['author'].strip():
        book.author = data['author'].strip()
    if 'category_id' in data and data['category_id']:
        book.category_id = int(data['category_id'])
    if 'description' in data:
        book.description = data['description']
    if 'page_count' in data and data['page_count']:
        book.page_count = int(data['page_count'])
    if 'language' in data:
        book.language = data['language']
    if 'published_year' in data:
        book.published_year = int(data['published_year']) if data['published_year'] else None
    if 'copyright_status' in data:
        book.copyright_status = data['copyright_status']
    if 'license_name' in data:
        book.license_name = data['license_name']
    if 'copyright_notes' in data:
        book.copyright_notes = data['copyright_notes']
    if 'is_featured' in data:
        val = data['is_featured']
        book.is_featured = val if isinstance(val, bool) else str(val).lower() in ('true', '1')
    if 'is_published' in data:
        val = data['is_published']
        book.is_published = val if isinstance(val, bool) else str(val).lower() in ('true', '1')
        
    # Handle files if uploaded
    if 'book_file' in request.files:
        book_file = request.files['book_file']
        if book_file and book_file.filename and allowed_file(book_file.filename):
            ext = book_file.filename.rsplit('.', 1)[-1].lower()
            book.file_type = ext
            book.file_url = StorageManager.save_file(book_file, subfolder="books", custom_prefix=book.slug[:15])
            
    if 'cover_image' in request.files:
        cover_image = request.files['cover_image']
        if cover_image and cover_image.filename and allowed_file(cover_image.filename):
            book.cover_url = StorageManager.save_file(cover_image, subfolder="covers", custom_prefix=f"cover_{book.slug[:15]}")
            
    if 'file_url' in data and data['file_url']:
        book.file_url = data['file_url']
    if 'cover_url' in data:
        book.cover_url = data['cover_url'] or None
        
    db.session.commit()
    return jsonify({'message': 'Book updated successfully', 'book': book.to_dict(full=True)})

@admin_bp.route('/books/<int:book_id>/toggle-publish', methods=['PATCH'])
@admin_required
def toggle_publish(book_id):
    book = Book.query.get_or_404(book_id)
    book.is_published = not book.is_published
    db.session.commit()
    return jsonify({'message': f"Book {'published' if book.is_published else 'unpublished'}", 'is_published': book.is_published})

@admin_bp.route('/books/<int:book_id>/toggle-featured', methods=['PATCH'])
@admin_required
def toggle_featured(book_id):
    book = Book.query.get_or_404(book_id)
    book.is_featured = not book.is_featured
    db.session.commit()
    return jsonify({'message': f"Book {'marked featured' if book.is_featured else 'unmarked featured'}", 'is_featured': book.is_featured})

@admin_bp.route('/books/<int:book_id>', methods=['DELETE'])
@admin_required
def delete_book(book_id):
    book = Book.query.get_or_404(book_id)
    db.session.delete(book)
    db.session.commit()
    return jsonify({'message': 'Book deleted successfully'})

@admin_bp.route('/upload', methods=['POST'])
@admin_required
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    subfolder = request.form.get('subfolder', 'books')
    if subfolder not in ['books', 'covers']:
        subfolder = 'books'
        
    if not file or not file.filename:
        return jsonify({'error': 'No selected file'}), 400
        
    if not allowed_file(file.filename):
        return jsonify({'error': 'File format not supported. Use PDF, EPUB, JPG, PNG, or WEBP'}), 400
        
    url = StorageManager.save_file(file, subfolder=subfolder)
    return jsonify({'url': url, 'filename': file.filename})

# ================= CATEGORY MANAGEMENT =================

@admin_bp.route('/categories', methods=['GET'])
@admin_required
def admin_list_categories():
    categories = Category.query.order_by(Category.name.asc()).all()
    result = []
    for c in categories:
        data = c.to_dict(include_counts=False)
        data['total_books'] = len(c.books)
        data['published_books'] = len([b for b in c.books if b.is_published])
        result.append(data)
    return jsonify({'categories': result})

@admin_bp.route('/categories', methods=['POST'])
@admin_required
def create_category():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    if not name:
        return jsonify({'error': 'Category name is required'}), 400
        
    base_slug = slugify(name)
    slug = base_slug
    counter = 1
    while Category.query.filter_by(slug=slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1
        
    category = Category(
        name=name,
        slug=slug,
        description=data.get('description', ''),
        icon=data.get('icon', 'BookOpen')
    )
    db.session.add(category)
    db.session.commit()
    return jsonify({'message': 'Category created', 'category': category.to_dict()}), 201

@admin_bp.route('/categories/<int:cat_id>', methods=['PUT'])
@admin_required
def update_category(cat_id):
    category = Category.query.get_or_404(cat_id)
    data = request.get_json() or {}
    
    if 'name' in data and data['name'].strip():
        category.name = data['name'].strip()
    if 'description' in data:
        category.description = data['description']
    if 'icon' in data:
        category.icon = data['icon']
        
    db.session.commit()
    return jsonify({'message': 'Category updated', 'category': category.to_dict()})

@admin_bp.route('/categories/<int:cat_id>', methods=['DELETE'])
@admin_required
def delete_category(cat_id):
    category = Category.query.get_or_404(cat_id)
    if category.books:
        return jsonify({'error': 'Cannot delete category that contains books. Please reassign or delete books first.'}), 400
    db.session.delete(category)
    db.session.commit()
    return jsonify({'message': 'Category deleted'})

# ================= ADVERTISEMENT CONFIGURATION =================

@admin_bp.route('/ads', methods=['GET'])
@admin_required
def admin_get_ads():
    ads = AdConfig.query.all()
    return jsonify({'ads': [a.to_dict() for a in ads]})

@admin_bp.route('/ads/<slot_key>', methods=['PUT'])
@admin_required
def update_ad_slot(slot_key):
    ad = AdConfig.query.filter_by(slot_key=slot_key).first_or_404()
    data = request.get_json() or {}
    
    if 'is_enabled' in data:
        val = data['is_enabled']
        ad.is_enabled = val if isinstance(val, bool) else str(val).lower() in ('true', '1')
    if 'ad_client_id' in data:
        ad.ad_client_id = data['ad_client_id'].strip()
    if 'ad_slot_id' in data:
        ad.ad_slot_id = data['ad_slot_id'].strip()
    if 'custom_html' in data:
        ad.custom_html = data['custom_html']
        
    db.session.commit()
    return jsonify({'message': f'Ad slot {ad.slot_name} updated', 'ad': ad.to_dict()})

# ================= COPYRIGHT COMPLAINTS & DMCA =================

@admin_bp.route('/reports', methods=['GET'])
@admin_required
def admin_get_reports():
    status = request.args.get('status')
    query = CopyrightReport.query
    if status:
        query = query.filter_by(status=status)
    reports = query.order_by(CopyrightReport.created_at.desc()).all()
    return jsonify({'reports': [r.to_dict() for r in reports]})

@admin_bp.route('/reports/<int:report_id>', methods=['PUT'])
@admin_required
def update_report_status(report_id):
    report = CopyrightReport.query.get_or_404(report_id)
    data = request.get_json() or {}
    new_status = data.get('status')
    if new_status in ['pending', 'reviewed', 'resolved']:
        report.status = new_status
        db.session.commit()
    return jsonify({'message': 'Report status updated', 'report': report.to_dict()})

# ================= SITE SETTINGS =================

@admin_bp.route('/settings', methods=['GET'])
@admin_required
def admin_get_settings():
    settings = SiteSetting.query.all()
    return jsonify({'settings': {s.key: s.to_dict() for s in settings}})

@admin_bp.route('/settings', methods=['PUT'])
@admin_required
def admin_update_settings():
    data = request.get_json() or {}
    for key, val in data.items():
        setting = SiteSetting.query.filter_by(key=key).first()
        if setting:
            setting.value = str(val)
        else:
            setting = SiteSetting(key=key, value=str(val))
            db.session.add(setting)
    db.session.commit()
    return jsonify({'message': 'Settings saved successfully'})
