package com.example.syncv.model.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

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
    private LocalDate matchDate;
    @Column(name = "user_id", nullable = false)
    private Long userId;
    @Column(name = "user_email", nullable = false)
    private String userEmail;

    public Match(Long cvId, Long jdId, String candidateName, String position, Double score, LocalDate matchDate, Long userId, String userEmail) {
        this.cvId = cvId;
        this.jdId = jdId;
        this.candidateName = candidateName;
        this.position = position;
        this.score = score;
        this.matchDate = matchDate;
        this.userId = userId;
        this.userEmail = userEmail;
    }

    public Match() {

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

    public LocalDate getMatchDate() {
        return matchDate;
    }

    public void setMatchDate(LocalDate matchDate) {
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
