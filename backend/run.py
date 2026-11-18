import os
from app import create_app
from app.seed_data import seed_database

app = create_app()

# Auto-create tables & seed default data on startup (works for both Gunicorn/Render and local dev)
with app.app_context():
    seed_database()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting eBook Library Backend on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
