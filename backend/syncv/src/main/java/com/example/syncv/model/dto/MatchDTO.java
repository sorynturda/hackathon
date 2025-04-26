package com.example.syncv.model.dto;

import java.time.LocalDateTime;

public record MatchDTO(
        Long id,
        Long cvId,
        Long jdId,
        String candidateName,
        String position,
        Double score,
        LocalDateTime matchDate,
        Long userId,
        String userEmail,
        String[] missingSkills,
        String[] matchingSkills,
        String reasoning
) {
}
