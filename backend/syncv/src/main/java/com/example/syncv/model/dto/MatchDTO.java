package com.example.syncv.model.dto;

import java.time.LocalDate;

public record MatchDTO(
        Long id,
        Long cvId,
        Long jdId,
        String candidateName,
        String position,
        Double score,
        LocalDate matchDate,
        Long userId,
        String userEmail
) {
}
