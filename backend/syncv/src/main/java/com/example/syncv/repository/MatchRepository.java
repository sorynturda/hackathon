package com.example.syncv.repository;

import com.example.syncv.model.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {
    void deleteAllByUserEmail(String userEmail);

    List<Match> findByUserEmail(String userEmail);
}
