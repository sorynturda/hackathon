package org.example.subscriber.service;


import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.example.subscriber.model.dto.JobDescriptionDTO;
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
            String json = objectMapper.readValue(body, String.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}