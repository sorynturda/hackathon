package com.example.syncv.model.dto.ml_service;

public class MatchResponseCVDTO {
    private Long resume_id;
    private Double similarity_score;

    public MatchResponseCVDTO(Long resume_id, Double similarity_score) {
        this.resume_id = resume_id;
        this.similarity_score = similarity_score;
    }

    public Double getSimilarity_score() {
        return similarity_score;
    }

    public void setSimilarity_score(Double similarity_score) {
        this.similarity_score = similarity_score;
    }
}
