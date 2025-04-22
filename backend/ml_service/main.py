import uvicorn
from controller import app


def start_server(host="0.0.0.0", port=7999):
    """Start the FastAPI server."""
    uvicorn.run(app, host=host, port=port)

if __name__ == "__main__":
    start_server()