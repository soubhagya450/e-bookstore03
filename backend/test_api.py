import json
from app import create_app
from app.models import db, Admin

app = create_app()

def run_tests():
    client = app.test_client()
    
    # 1. Test health check
    res = client.get('/api/health')
    assert res.status_code == 200, f"Health check failed: {res.status_code}"
    print("[PASS] GET /api/health:", res.get_json())
    
    # 2. Test list books
    res = client.get('/api/books')
    assert res.status_code == 200
    data = res.get_json()
    assert len(data['books']) > 0
    print(f"[PASS] GET /api/books: Found {len(data['books'])} books. First book: '{data['books'][0]['title']}'")
    
    # 3. Test categories
    res = client.get('/api/categories')
    assert res.status_code == 200
    cats = res.get_json()
    assert len(cats['categories']) > 0
    print(f"[PASS] GET /api/categories: Found {len(cats['categories'])} categories.")
    
    # 4. Test book detail
    book_slug = data['books'][0]['slug']
    res = client.get(f'/api/books/{book_slug}')
    assert res.status_code == 200
    book_data = res.get_json()
    assert book_data['book']['title'] == data['books'][0]['title']
    print(f"[PASS] GET /api/books/{book_slug}: Successfully retrieved details & related books.")
    
    # 5. Test ad config
    res = client.get('/api/ads')
    assert res.status_code == 200
    ads_data = res.get_json()
    assert 'home_hero' in ads_data['ads']
    print(f"[PASS] GET /api/ads: Public ad slots loaded ({list(ads_data['ads'].keys())}).")
    
    # 6. Test Admin Login
    res = client.post('/api/admin/login', json={'username': 'admin', 'password': 'admin123'})
    assert res.status_code == 200
    login_data = res.get_json()
    token = login_data['token']
    assert token is not None
    print("[PASS] POST /api/admin/login: Admin authenticated successfully. JWT token issued.")
    
    # 7. Test Admin Stats with Auth Header
    res = client.get('/api/admin/stats', headers={'Authorization': f'Bearer {token}'})
    print("Stats response:", res.status_code, res.get_json())
    assert res.status_code == 200
    stats_data = res.get_json()
    print("[PASS] GET /api/admin/stats:", stats_data['stats'])
    
    print("\nALL BACKEND API TESTS PASSED WITH 100% SUCCESS!")

if __name__ == '__main__':
    with app.app_context():
        run_tests()
