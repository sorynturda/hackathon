import uvicorn
from subscriber import RedisSubscriber
from controller import app
from transform.decoder import callGemini  
from models.cv import CV
from models.jd import JD
from transform.transform import transform


subscriber = None

def message_callback(channel, data):
    print(f'Received message on channel {channel} : {data}')
    transform(data)
  
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