
import os
import sys
from pydantic import ValidationError

# Mocking parts of the app to test validation
from app.models.chat import ChatResponse
from datetime import datetime
from uuid import uuid4

def test_validation():
    print("Testing ChatResponse validation with integer user_id...")
    data = {
        "id": uuid4(),
        "user_id": 1,  # This is the problematic integer
        "document_id": "doc123",
        "title": "Test Chat",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
    
    try:
        # Simulate what ChatRepository now does
        data["user_id"] = str(data["user_id"])
        chat_resp = ChatResponse(**data)
        print("Successfully validated with string user_id")
    except ValidationError as e:
        print(f"Validation failed: {e}")

if __name__ == "__main__":
    test_validation()
