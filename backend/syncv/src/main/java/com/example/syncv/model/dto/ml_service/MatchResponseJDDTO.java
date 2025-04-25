package com.example.syncv.model.dto.ml_service;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MatchResponseJDDTO {
    private String candidate_name;
    private List<JobDTO> jobs;

    public MatchResponseJDDTO(String candidate_name, List<JobDTO> jobs) {
        this.candidate_name = candidate_name;
        this.jobs = jobs;
    }

    public String getCandidate_name() {
        return candidate_name;
    }

    public List<JobDTO> getJobs() {
        return jobs;
    }
}
