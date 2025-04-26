package com.example.syncv.controller;

import com.example.syncv.model.dto.MatchDTO;
import com.example.syncv.model.entity.Match;
import com.example.syncv.service.MatchGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/match-generator")
public class MatchGeneratorController {

    private final MatchGeneratorService matchGeneratorService;

    @Autowired
    public MatchGeneratorController(MatchGeneratorService matchGeneratorService) {
        this.matchGeneratorService = matchGeneratorService;
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateMatches() {
        try {
            List<Match> generatedMatches = matchGeneratorService.generateSampleMatches();

            // Convert the entities to DTOs
            List<MatchDTO> matchDTOs = generatedMatches.stream()
                    .map(m -> new MatchDTO(
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
                            m.getMatchingSkills().split(" ")
                    ))
                    .collect(Collectors.toList());

            return ResponseEntity.status(HttpStatus.CREATED).body(matchDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to generate matches: " + e.getMessage());
        }
    }
}