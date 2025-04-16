package com.example.syncv.controller;

import com.example.syncv.service.MessagePublisher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class MessageController {

    private MessagePublisher messagePublisher;

    @Autowired
    public MessageController(MessagePublisher messagePublisher) {
        this.messagePublisher = messagePublisher;
    }

    @GetMapping(path = "/publish")
    public String publishMessage(@RequestParam String message) {
        messagePublisher.publish("etl-backend", message);
        return "Message published";
    }
}
