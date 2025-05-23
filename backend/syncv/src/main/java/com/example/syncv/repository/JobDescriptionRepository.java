package com.example.syncv.repository;

import com.example.syncv.model.dto.JobDescriptionDTO;
import com.example.syncv.model.entity.JobDescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface JobDescriptionRepository extends JpaRepository<JobDescription, Long> {
    @Query("SELECT new com.example.syncv.model.dto.JobDescriptionDTO(jd.id, jd.user.id, u.name, jd.name, jd.size, jd.type, jd.uploadedAt) FROM JobDescription jd JOIN jd.user u WHERE jd.user.id = :userId")
    List<JobDescriptionDTO> findDTOsByUserId(@Param("userId") Long userId);

    @Query("SELECT new com.example.syncv.model.dto.JobDescriptionDTO(jd.id, jd.user.id, u.name, jd.name, jd.size, jd.type, jd.uploadedAt)" +
            " FROM JobDescription jd JOIN jd.user u WHERE  jd.user.id = :userId AND jd.name = :fileName")
    Optional<JobDescriptionDTO> findByUserIdAndName(Long userId, String fileName);
    @Modifying
    @Transactional
    @Query("DELETE FROM JobDescription jd WHERE jd.user.id = :userId")
    void deleteAllByUser_Id(@Param("userId") Long userId);
}
