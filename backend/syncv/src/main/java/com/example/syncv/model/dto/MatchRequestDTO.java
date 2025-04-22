package com.example.syncv.model.dto;

import java.util.List;

public class MatchRequestDTO {
    private Long id;
    private Long userId;
    private Integer limit;
    private List<InputDTO> inputs;

    public MatchRequestDTO(Long id, Long userId, Integer limit, List<InputDTO> inputs) {
        this.id = id;
        this.userId = userId;
        this.limit = limit;
        this.inputs = inputs;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public Integer getLimit() {
        return limit;
    }

    public List<InputDTO> getInputs() {
        return inputs;
    }
}
