package com.example.syncv.repository;

import com.example.syncv.model.entity.JobDescription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JDRepository extends JpaRepository<JobDescription, Long> {
}
