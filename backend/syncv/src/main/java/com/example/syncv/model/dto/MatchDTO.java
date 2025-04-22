package com.example.syncv.model.dto;

public class MatchDTO {
    private Long id;
    private Long userId;

    public MatchDTO(Long id, Long userId) {
        this.id = id;
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }
}
