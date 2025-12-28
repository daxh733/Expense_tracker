from config.db import db

def test_connection():
    print(db.list_collection_names())

if __name__ == "__main__":
    test_connection()
