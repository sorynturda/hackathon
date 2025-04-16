package com.example.syncv.service;

import com.example.syncv.controller.MessageController;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class MessagePublisherService {

    private RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public MessagePublisherService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void publish(String channel, Object messageObject) {
        try {
            String jsonMessage = objectMapper.writeValueAsString(messageObject);
            redisTemplate.convertAndSend(channel, jsonMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}