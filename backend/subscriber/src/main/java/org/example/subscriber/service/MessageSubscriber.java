package org.example.subscriber.service;

import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Service;

@Service
public class MessageSubscriber implements MessageListener {

    @Override
    public void onMessage(Message message, byte[] pattern) {
        System.out.println("Received message: " + message.toString());
    }
}