package com.example.syncv.model.dto;

public class FileDTO {
    private Long id;
    private String type;

    public FileDTO(Long id, String type) {
        this.id = id;
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public String getType() {
        return type;
    }
}
