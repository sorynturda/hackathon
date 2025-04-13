package com.example.syncv.repository;

import com.example.syncv.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;


import java.lang.ScopedValue;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
