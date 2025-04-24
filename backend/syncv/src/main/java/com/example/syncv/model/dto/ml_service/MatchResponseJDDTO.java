package com.example.syncv.model.dto.ml_service;

public class MatchResponseJDDTO {
    private Long job_id;
    private Double similarity_score;

    public MatchResponseJDDTO(Long job_id, Double similarity_score) {
        this.job_id = job_id;
        this.similarity_score = similarity_score;
    }

    public Long getJob_id() {
        return job_id;
    }

    public Double getSimilarity_score() {
        return similarity_score;
    }

    @Override
    public String toString() {
        return "MatchResponseDTO{" +
                "id=" + job_id +
                ", score=" + similarity_score +
                '}';
    }
}
