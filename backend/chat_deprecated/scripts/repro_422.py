import requests
import uuid

BASE_URL = "http://localhost:8080"

def test_get_messages_no_userid():
    chat_id = str(uuid.uuid4())
    url = f"{BASE_URL}/api/chats/{chat_id}/messages"
    response = requests.get(url)
    print(f"GET {url} (no user_id)")
    print(f"Status: {response.status_code}")
    print(f"Body: {response.json()}")

def test_get_messages_with_userid_not_found():
    chat_id = str(uuid.uuid4())
    url = f"{BASE_URL}/api/chats/{chat_id}/messages?user_id=1"
    response = requests.get(url)
    print(f"GET {url} (user_id=1, random chat_id)")
    print(f"Status: {response.status_code}")
    print(f"Body: {response.json()}")

if __name__ == "__main__":
    try:
        test_get_messages_no_userid()
        print("-" * 20)
        test_get_messages_with_userid_not_found()
    except Exception as e:
        print(f"Error: {e}")
