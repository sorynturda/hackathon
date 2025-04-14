package com.example.syncv.repository;

import com.example.syncv.model.dto.JobDescriptionDTO;
import com.example.syncv.model.entity.JobDescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface JobDescriptionRepository extends JpaRepository<JobDescription, Long> {
    @Query("SELECT new com.example.syncv.model.dto.JobDescriptionDTO(jd.name, u.name, jd.size, jd.type, jd.uploadedAt, jd.user.id, jd.id) FROM JobDescription jd JOIN jd.user u WHERE jd.user.id = :userId")
    List<JobDescriptionDTO> findDTOsByUserId(@Param("userId") Long userId);

    @Query("SELECT new com.example.syncv.model.dto.JobDescriptionDTO(jd.name, u.name, jd.size, jd.type, jd.uploadedAt, jd.user.id, jd.id)" +
            " FROM JobDescription jd JOIN jd.user u WHERE  jd.user.id = :userId AND jd.name = :fileName")
    Optional<JobDescriptionDTO> findByUserAndName(Long userId, String fileName);
}
