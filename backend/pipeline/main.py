import uvicorn
from subscriber import RedisSubscriber
from controller import app
from transform.decoder import callGemini  
from models.cv import CV
from models.jd import JD
from transform.transform import transform
from load.load import load_cvs, load_jds, delete_cvs, delete_jds

subscriber = None

def message_callback(channel, data):
    print(f'Received message on channel {channel} : {data}')
    transformed_data, load_collection = transform(data)
    
    # Skip loading if no data to load (e.g., in case of delete operation)
    if not transformed_data:
        return
        
    if load_collection == 'cvs':
        load_cvs(transformed_data)
    elif load_collection == 'jds':
        load_jds(transformed_data)
        
@app.on_event("startup")
async def startup_event():
    """Initialize services on startup."""
    global subscriber
    # Use the service name 'redis' as the host since we're in Docker
    redis_host = 'redis'
    redis_port = 6379
    
    # Automatically connect to channel
    channel_name = "canaljmeker"
    subscriber = RedisSubscriber(host='redis', port=6379, channel=channel_name)
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