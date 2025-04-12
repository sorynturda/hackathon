package com.example.syncv.repository;

import com.example.syncv.model.entity.JDEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JDRepository extends JpaRepository<JDEntity, Long> {
}
