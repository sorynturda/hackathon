package com.example.syncv.model.dto;

public class MatchResponseDTO {
    private Long id;
    private Double score;

    public MatchResponseDTO(Long id, Double score) {
        this.id = id;
        this.score = score;
    }

    public Long getId() {
        return id;
    }

    public Double getScore() {
        return score;
    }
}
