import redis
import json
import time
import threading

class RedisSubscriber:
    def __init__(self, host='localhost', port=5004, channel='default'):
        self.redis_client = redis.Redis(host=host, port=port, decode_responses=True)
        self.pubsub = self.redis_client.pubsub()
        self.channel = channel
        self.running = False
        self.thread = None
        self.message_callback = None
        
    def set_callback(self, callback):
        self.message_callback = callback
        
    def message_handler(self, message):
        """Handle incoming messages."""
        if message['type'] == 'message':
            try:
                # Parse the JSON message
                data = json.loads(message['data'])
               # print(f"Received message on channel {self.channel}: {data}")
                # Call the callback function if set
                if self.message_callback:
                    self.message_callback(self.channel, data)
            except json.JSONDecodeError:
                print(f"Received non-JSON message: {message['data']}")
                if self.message_callback:
                    self.message_callback(self.channel, message['data'])
            except Exception as e:
                print(f"Error processing message: {e}")
    
    def subscribe(self):
        self.pubsub.subscribe(**{self.channel: self.message_handler})
        print(f"Subscribed to channel: {self.channel}")
        
    def start_listening(self):
        print(f"Listening for messages on channel '{self.channel}'...")
        try:
            self.subscribe()
            self.running = True
            while self.running:
                self.pubsub.get_message()
                time.sleep(0.001)
        except Exception as e:
            print(f"Error in subscription: {e}")
            
    def run_in_thread(self):
        self.thread = threading.Thread(target=self.start_listening)
        self.thread.daemon = True
        self.thread.start()
        return self.thread
            
    def stop(self):
        self.running = False
        if self.thread:
            self.thread.join(timeout=1.0)
        self.pubsub.unsubscribe()
        self.redis_client.close()
        print(f"Stopped listening on channel {self.channel}")