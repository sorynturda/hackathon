package org.example.subscriber.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

public class JobDescriptionDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String name;
    private Long size;
    private String type;
    private LocalDateTime uploadedAt;

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
