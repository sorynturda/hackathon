package com.example.syncv.model.dto.ml_service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MatchResponseCVDTO {
    private String job_position;
    private List<CandidateDTO> candidates;

    public MatchResponseCVDTO(String job_position, List<CandidateDTO> candidates) {
        this.job_position = job_position;
        this.candidates = candidates;
    }

    public String getJob_position() {
        return job_position;
    }

    public List<CandidateDTO> getCandidates() {
        return candidates;
    }
}
