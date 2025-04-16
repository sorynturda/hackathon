package org.example.subscriber.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
public class MessageSubscriber implements MessageListener {

    private ObjectMapper objectMapper = new ObjectMapper();

    public MessageSubscriber() {
        objectMapper.findAndRegisterModules();
    }

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String body = new String(message.getBody(), StandardCharsets.UTF_8);
            System.out.println(body);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}