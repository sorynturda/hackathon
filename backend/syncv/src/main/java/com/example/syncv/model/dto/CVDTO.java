package com.example.syncv.model.dto;

import java.time.LocalDateTime;

public class CVDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String name;
    private Long size;
    private String type;
    private LocalDateTime uploadedAt;

    public CVDTO() {
    }

    public CVDTO(Long id, Long userId, String userName, String name, Long size, String type, LocalDateTime uploadedAt) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.name = name;
        this.size = size;
        this.type = type;
        this.uploadedAt = uploadedAt;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
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
