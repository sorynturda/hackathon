package com.example.syncv.controller;

import com.example.syncv.model.dto.JobDescriptionDTO;
import com.example.syncv.model.entity.JobDescription;
import com.example.syncv.service.JobDescriptionService;
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
@RequestMapping("/api/job-descriptions")
public class JobDescriptionController {

    private final JobDescriptionService jobDescriptionService;

    @Autowired
    public JobDescriptionController(JobDescriptionService jobDescriptionService) {
        this.jobDescriptionService = jobDescriptionService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadJobDescription(@RequestParam("file") MultipartFile file) {
        try {
            // Get authenticated user (by email)
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUserEmail = authentication.getName();


            JobDescription savedJD = jobDescriptionService.store(file, currentUserEmail);


            JobDescriptionDTO jdDTO = new JobDescriptionDTO(
                    savedJD.getName(),
                    savedJD.getUser().getName(),
                    savedJD.getSize(),
                    savedJD.getType(),
                    savedJD.getUploadedAt(),
                    savedJD.getUser().getId(),
                    savedJD.getId()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(jdDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload job description: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJobDescription(@PathVariable Long id) {
        try {
            JobDescription jd = jobDescriptionService.getJobDescription(id);

            JobDescriptionDTO jdDTO = new JobDescriptionDTO(
                    jd.getName(),
                    jd.getUser().getName(),
                    jd.getSize(),
                    jd.getType(),
                    jd.getUploadedAt(),
                    jd.getUser().getId(),
                    jd.getId()
            );

            return ResponseEntity.ok(jdDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<?> downloadJobDescription(@PathVariable Long id) {
        try {
            JobDescription jd = jobDescriptionService.getJobDescription(id);
            byte[] data = jobDescriptionService.getJobDescriptionData(id);

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + jd.getName() + "\"")
                    .contentType(org.springframework.http.MediaType.parseMediaType(jd.getType()))
                    .body(data);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/my-job-descriptions")
    public ResponseEntity<?> getAllMyJobDescriptions() {
        try {
            // Get authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUserEmail = authentication.getName();

            System.out.println("toate fisierele");
            List<JobDescriptionDTO> jdDTOs = jobDescriptionService.getAllJobDescriptionsByUser(currentUserEmail);


            return ResponseEntity.ok(jdDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve job descriptions: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJobDescription(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUserEmail = authentication.getName();

            jobDescriptionService.deleteJobDescription(id, currentUserEmail);
            return ResponseEntity.ok("Job description deleted successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete job description: " + e.getMessage());
        }
    }
}
