package com.example.syncv.service;

import com.example.syncv.model.dto.MatchDTO;
import com.example.syncv.model.dto.ml_service.CandidateDTO;
import com.example.syncv.model.dto.ml_service.JobDTO;
import com.example.syncv.model.dto.ml_service.MatchResponseCVDTO;
import com.example.syncv.model.dto.ml_service.MatchResponseJDDTO;
import com.example.syncv.model.entity.Match;
import com.example.syncv.repository.MatchRepository;
import com.example.syncv.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class MatchService {
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;

    @Autowired
    public MatchService(MatchRepository matchRepository, UserRepository userRepository) {
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
    }

    public void storeMatchesCandidates(Long userId, Long jdId, MatchResponseCVDTO res) {
        List<Match> matches = new ArrayList<>();
        String jobPosition = res.getJob_position();
        for (CandidateDTO candidate : res.getCandidates()) {
            Match match = new Match();
            match.setCvId(candidate.getCv_id());
            match.setJdId(jdId);
            match.setCandidateName(candidate.getCandidate_name());
            match.setPosition(jobPosition);
            match.setScore(candidate.getOverall_match());
            match.setMatchDate(LocalDateTime.now());
            match.setUserEmail(userRepository.findById(userId).get().getEmail());
            match.setUserId(userId);
            match.setMissingSkills(String.join(" ", candidate.getMissing_skills_req()));
            match.setMatchingSkills(String.join(" ", candidate.getMatching_skills_req()));
            match.setReasoning(candidate.getReasoning());

            matches.add(match);
        }
        matchRepository.saveAll(matches);
    }

    public void storeMatchesJobs(Long userId, Long cvId, MatchResponseJDDTO res) {
        List<Match> matches = new ArrayList<>();
        String candidateName = res.getCandidate_name();
        for (JobDTO job : res.getJobs()) {
            Match match = new Match();
            match.setMatchingSkills(String.join(" ", job.getMatching_skills_req()));
            match.setMatchDate(LocalDateTime.now());
            match.setCandidateName(candidateName);
            match.setCvId(cvId);
            match.setPosition(job.getJob_position());
            match.setScore(job.getOverall_match());
            match.setMissingSkills(String.join(" ", job.getMissing_skills_req()));
            match.setJdId(job.getJob_id());
            match.setUserId(userId);
            match.setUserEmail(userRepository.findById(userId).get().getEmail());
            match.setReasoning(job.getReasoning());

            matches.add(match);
        }
        matchRepository.saveAll(matches);
    }

    public MatchDTO getMatch(Long id) {
        Match match = matchRepository.findById(id).
                orElseThrow(() -> new RuntimeException("Match with id: " + id + " not found!"));
        return new MatchDTO(
                match.getId(),
                match.getCvId(),
                match.getJdId(),
                match.getCandidateName(),
                match.getPosition(),
                match.getScore(),
                match.getMatchDate(),
                match.getUserId(),
                match.getUserEmail(),
                match.getMissingSkills().split(" "),
                match.getMatchingSkills().split(" "),
                match.getReasoning()
        );
    }

    public List<MatchDTO> getAllMatchesByUser(String userEmail) {
        return matchRepository.findByUserEmail(userEmail).stream()
                .map(m ->
                        new MatchDTO(
                                m.getId(),
                                m.getCvId(),
                                m.getJdId(),
                                m.getCandidateName(),
                                m.getPosition(),
                                m.getScore(),
                                m.getMatchDate(),
                                m.getUserId(),
                                m.getUserEmail(),
                                m.getMissingSkills().split(" "),
                                m.getMatchingSkills().split(" "),
                                m.getReasoning()
                        )).toList();
    }

    @Transactional
    public void deleteAll(String userEmail) {
        matchRepository.deleteAllByUserEmail(userEmail);
    }

}
