import os
from app import create_app
from app.models import db
from app.seed_data import seed_database

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        # Auto-create tables & seed data on start
        seed_database()
        
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting eBook Library Backend on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
