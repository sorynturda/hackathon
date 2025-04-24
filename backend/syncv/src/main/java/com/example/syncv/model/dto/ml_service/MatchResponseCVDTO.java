package com.example.syncv.model.dto.ml_service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
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

    public Long getResume_id() {
        return resume_id;
    }
}
