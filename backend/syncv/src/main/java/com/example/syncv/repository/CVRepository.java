package com.example.syncv.repository;


import com.example.syncv.model.dto.CVDTO;
import com.example.syncv.model.entity.CV;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CVRepository extends JpaRepository<CV, Long> {
    @Query("SELECT new com.example.syncv.model.dto.CVDTO(cv.id, cv.user.id, u.name, cv.name, cv.size, cv.type, cv.uploadedAt) FROM CV cv JOIN cv.user u WHERE cv.user.id = :userId")
    List<CVDTO> findDTOsByUserId(@Param("userId") Long userId);

}
   // CVDTO constructor: Long id, Long userId, String userName, String name, Long size, String type, LocalDateTime uploadedAt
