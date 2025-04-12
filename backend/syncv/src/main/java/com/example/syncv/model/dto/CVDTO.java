package com.example.syncv.model.dto;

import java.time.LocalDateTime;

public class CVDTO {
    private Long id;
    private String name;
    private Long size;
    private String type;
    private LocalDateTime uploadedAt;

    public CVDTO(Long id, String name, Long size, String type, LocalDateTime uploadedAt) {
        this.id = id;
        this.name = name;
        this.size = size;
        this.type = type;
        this.uploadedAt = uploadedAt;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Long getSize() {
        return size;
    }

    public String getType() {
        return type;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }
}
