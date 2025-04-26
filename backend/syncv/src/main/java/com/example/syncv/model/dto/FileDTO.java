package com.example.syncv.model.dto;

public class FileDTO {
    private Long id;
    private String type;
    private boolean delete;

    public FileDTO(Long id, String type, boolean delete) {
        this.id = id;
        this.type = type;
        this.delete=delete;
    }

    public Long getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public boolean isDelete() {
        return delete;
    }
}
