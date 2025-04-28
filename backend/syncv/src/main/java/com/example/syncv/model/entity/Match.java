package com.example.syncv.model.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "matches")
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "cv_id", nullable = false)
    private Long cvId;
    @Column(name = "jd_id", nullable = false)
    private Long jdId;
    @Column(name = "candidate_name", nullable = false)
    private String candidateName;
    @Column(name = "position", nullable = false)
    private String position;
    @Column(name = "score", nullable = false)
    private Double score;
    @CreationTimestamp
    @Column(name = "match_date", nullable = false)
    private LocalDateTime matchDate;
    @Column(name = "user_id", nullable = false)
    private Long userId;
    @Column(name = "user_email", nullable = false)
    private String userEmail;
    @Column(name = "missing_skills", nullable = false, length = 5000)
    private String missingSkills;
    @Column(name = "matching_skills", nullable = false, length = 5000)
    private String matchingSkills;
    @Column(name= "reasoning", nullable = false, length = 5000)
    private String reasoning;

    public void setId(Long id) {
        this.id = id;
    }

    public String getReasoning() {
        return reasoning;
    }

    public void setReasoning(String reasoning) {
        this.reasoning = reasoning;
    }

    public String getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(String missingSkills) {
        this.missingSkills = missingSkills;
    }

    public String getMatchingSkills() {
        return matchingSkills;
    }

    public void setMatchingSkills(String matchingSkills) {
        this.matchingSkills = matchingSkills;
    }

    public Long getId() {
        return id;
    }

    public Long getCvId() {
        return cvId;
    }

    public void setCvId(Long cvId) {
        this.cvId = cvId;
    }

    public Long getJdId() {
        return jdId;
    }

    public void setJdId(Long jdId) {
        this.jdId = jdId;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public LocalDateTime getMatchDate() {
        return matchDate;
    }

    public void setMatchDate(LocalDateTime matchDate) {
        this.matchDate = matchDate;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }
}
