package com.example.syncv.model.dto;

public class InputDTO {
    private String skill;
    private Double weight;

    public InputDTO(String skill, Double weight) {
        this.skill = skill;
        this.weight = weight;
    }

    public String getSkill() {
        return skill;
    }

    public Double getWeight() {
        return weight;
    }
}
