package com.example.syncv.controller;

import com.example.syncv.model.dto.CVDTO;
import com.example.syncv.model.entity.CV;
import com.example.syncv.service.CVService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/cvs")
public class CVController {
    private final CVService cvService;

    @Autowired
    public CVController(CVService cvService) {
        this.cvService = cvService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadCV(@RequestParam("file") MultipartFile file) {
        try {
            // Get authenticated user (by email)
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUserEmail = authentication.getName();


            CV savedCV = cvService.store(file, currentUserEmail);

            // Long id, Long userId, String userName, String name, Long size, String type, LocalDateTime uploadedAt)

            CVDTO cvDTO = new CVDTO(
                    savedCV.getId(),
                    savedCV.getUser().getId(),
                    savedCV.getUser().getName(),
                    savedCV.getName(),
                    savedCV.getSize(),
                    savedCV.getType(),
                    savedCV.getUploadedAt()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(cvDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload CV: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCV(@PathVariable Long id) {
        try {
            CV cv = cvService.getCV(id);

            CVDTO cvDTO = new CVDTO(
                    cv.getId(),
                    cv.getUser().getId(),
                    cv.getUser().getName(),
                    cv.getName(),
                    cv.getSize(),
                    cv.getType(),
                    cv.getUploadedAt()
            );

            return ResponseEntity.ok(cvDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<?> downloadCV(@PathVariable Long id) {
        try {
            CV cv = cvService.getCV(id);
            byte[] data = cvService.getCVData(id);

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + cv.getName() + "\"")
                    .contentType(org.springframework.http.MediaType.parseMediaType(cv.getType()))
                    .body(data);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/my-cvs")
    public ResponseEntity<?> getAllMyCVs() {
        try {
            // Get authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUserEmail = authentication.getName();

            List<CVDTO> cvDTOs = cvService.getAllCVsByUser(currentUserEmail);


            return ResponseEntity.ok(cvDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve cv: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCV(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUserEmail = authentication.getName();

            cvService.deleteCV(id, currentUserEmail);
            return ResponseEntity.ok("CV with id: " + id + " deleted successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete CV: " + e.getMessage());
        }

    }
}
