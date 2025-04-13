package com.example.syncv.repository;


import com.example.syncv.model.entity.CV;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CVRepository extends JpaRepository<CV, Long> {
}
