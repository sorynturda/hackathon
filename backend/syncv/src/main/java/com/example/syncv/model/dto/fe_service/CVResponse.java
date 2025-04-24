package com.example.syncv.model.dto.fe_service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CVResponse(Long id, Long userId, String cvName, Double score) {
}
