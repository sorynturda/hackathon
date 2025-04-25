package com.example.syncv.model.dto.ml_service;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)

public class JobDTO {
    private Long job_id;
    private String job_position;
    private Double overall_match;
    private String[] missing_skills_req;
    private String[] matching_skills_req;

    public JobDTO(Long job_id, String job_position, Double overall_match, String[] missing_skills_req, String[] matching_skills_req) {
        this.job_id = job_id;
        this.job_position = job_position;
        this.overall_match = overall_match;
        this.missing_skills_req = missing_skills_req;
        this.matching_skills_req = matching_skills_req;
    }

    public Long getJob_id() {
        return job_id;
    }

    public String getJob_position() {
        return job_position;
    }

    public Double getOverall_match() {
        return overall_match;
    }

    public String[] getMissing_skills_req() {
        return missing_skills_req;
    }

    public String[] getMatching_skills_req() {
        return matching_skills_req;
    }
}
