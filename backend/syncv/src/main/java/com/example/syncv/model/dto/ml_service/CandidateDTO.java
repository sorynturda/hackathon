package com.example.syncv.model.dto.ml_service;

public class CandidateDTO {
    private Long cv_id;
    private String candidate_name;
    private Double overall_match;
    private String[] missing_skills_req;
    private String[] matching_skills_req;
    private String reasoning;

    public CandidateDTO(Long cv_id, String candidate_name, Double overall_match, String[] missing_skills_req, String[] matching_skills_req, String reasoning) {
        this.cv_id = cv_id;
        this.candidate_name = candidate_name;
        this.overall_match = overall_match;
        this.missing_skills_req = missing_skills_req;
        this.matching_skills_req = matching_skills_req;
        this.reasoning = reasoning;
    }

    public String getReasoning() {
        return reasoning;
    }

    public Long getCv_id() {
        return cv_id;
    }

    public String getCandidate_name() {
        return candidate_name;
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
