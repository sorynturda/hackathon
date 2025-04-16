package com.example.syncv.controller;

import com.example.syncv.service.MessagePublisherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class MessageController {

    private MessagePublisherService messagePublisherService;

    @Autowired
    public MessageController(MessagePublisherService messagePublisherService) {
        this.messagePublisherService = messagePublisherService;
    }

    @GetMapping(path = "/publish")
    public String publishMessage(@RequestParam String message) {
        messagePublisherService.publish("etl-backend", message);
        return "Message published";
    }
}
