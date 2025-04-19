from fastapi import FastAPI
from typing import Dict, Any

# Create FastAPI app
app = FastAPI(title="Redis Subscriber API")

# Global variable to store last received messages
last_messages = {}

@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Redis Subscriber API is running"}

@app.get("/messages")
async def get_messages():
    """Get the last received messages."""
    return last_messages

@app.get("/messages/{channel}")
async def get_channel_message(channel: str):
    """Get the last received message for a specific channel."""
    if channel in last_messages:
        return last_messages[channel]
    return {"error": f"No messages received on channel {channel} yet"}