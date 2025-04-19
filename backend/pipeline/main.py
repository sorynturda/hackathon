import time
import uvicorn
from subscriber import RedisSubscriber
from controller import app, last_messages
from decoder import callGeminiForCV
from pg_db import SessionLocal
import json
import io
from models.cv import CV
import ast
subscriber = None


def read_large_object_from_oid(session, oid: int) -> bytes:
    raw_conn = session.connection().connection
    lo = raw_conn.lobject(oid, 'rb')
    data = lo.read()
    lo.close()
    return data

def message_callback(channel, data):
    db = SessionLocal()
    try:
        print(f'Received message on channel {channel} : {data}')
        messages = json.loads(data)

        if not isinstance(messages, list):
            print("Expected a list of objects")
            return
    
        for item in messages:
            item_type = item.get("type")
            item_id = item.get("id")
            if item_type == 'cvs' and item_id is not None:
                cv = db.query(CV).filter(CV.id == item_id).first()
                if cv:
                    file_data = read_large_object_from_oid(db, cv.data)
                    cv_doc = io.BytesIO(file_data)
                    if cv.type.endswith('.document'):
                        print(callGeminiForCV(cv_doc, 'docx'))
                    elif cv.type.endswith('pdf'):
                        model_response = callGeminiForCV(cv_doc,'pdf')
                        print(model_response)
                        dict_response = json.loads(model_response)
                        print(dict_response['PROFESSIONAL_EXPERIENCE'][0]['company'])
                        
    except Exception as e:
        print(e)
  

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup."""
    global subscriber
    # Automatically connect to "your-channel" on startup
    channel_name = "canaljmeker"
    subscriber = RedisSubscriber(host='localhost', port=5004, channel=channel_name)
    subscriber.set_callback(message_callback)
    subscriber.run_in_thread()
    print(f"Automatically subscribed to channel: {channel_name}")

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up resources before shutdown."""
    global subscriber
    if subscriber:
        subscriber.stop()

def start_server(host="0.0.0.0", port=8000):
    """Start the FastAPI server."""
    uvicorn.run(app, host=host, port=port)

if __name__ == "__main__":
    start_server()