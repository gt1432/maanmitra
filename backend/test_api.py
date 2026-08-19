import json
from backend.app import app

def test_endpoints():
    client = app.test_client()
    
    print("--- 1. Testing /api/analyze-text ---")
    res1 = client.post('/api/analyze-text', json={'text': 'I am feeling very stressed because of my exams.'})
    print("Status:", res1.status_code)
    print("Payload:", json.dumps(res1.get_json(), indent=2))
    
    print("\n--- 2. Testing /api/risk-check (Crisis Safety) ---")
    res2 = client.post('/api/risk-check', json={'text': 'I feel like ending my life.'})
    print("Status:", res2.status_code)
    print("Payload:", json.dumps(res2.get_json(), indent=2))
    
    print("\n--- 3. Testing /api/chat ---")
    res3 = client.post('/api/chat', json={'message': 'I am unable to focus on my studies.'})
    print("Status:", res3.status_code)
    print("Payload:", json.dumps(res3.get_json(), indent=2))
    
    print("\n--- 4. Testing /api/model-metrics ---")
    res4 = client.get('/api/model-metrics')
    print("Status:", res4.status_code)
    print("Metrics Available:", list(res4.get_json().keys()))

if __name__ == '__main__':
    test_endpoints()
