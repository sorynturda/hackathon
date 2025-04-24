package com.example.syncv.controller;

import com.example.syncv.model.dto.FileDTO;
import com.example.syncv.model.dto.JobDescriptionDTO;
import com.example.syncv.model.entity.JobDescription;
import com.example.syncv.service.JobDescriptionService;
import com.example.syncv.service.MessagePublisherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/jds")
public class JobDescriptionController {


    private final JobDescriptionService jobDescriptionService;
    private final MessagePublisherService messagePublisherService;

    @Value("${redis.channel}")
    private String channel;

    @Autowired
    public JobDescriptionController(JobDescriptionService jobDescriptionService, MessagePublisherService messagePublisherService) {
        this.jobDescriptionService = jobDescriptionService;
        this.messagePublisherService = messagePublisherService;
    }

    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadJobDescription(@RequestParam("file") MultipartFile file) {
        try {
            // Get authenticated user (by email)
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUserEmail = authentication.getName();


            JobDescription savedJD = jobDescriptionService.store(file, currentUserEmail);


            JobDescriptionDTO jdDTO = new JobDescriptionDTO(
                    savedJD.getId(),
                    savedJD.getUser().getId(),
                    savedJD.getUser().getName(),
                    savedJD.getName(),
                    savedJD.getSize(),
                    savedJD.getType(),
                    savedJD.getUploadedAt()
            );
            List<FileDTO> jds = new ArrayList<>();
            jds.add(new FileDTO(jdDTO.getId(), "jds"));
            messagePublisherService.publish(channel, jds);
            return ResponseEntity.status(HttpStatus.CREATED).body(jdDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload job description: " + e.getMessage());
        }
    }

    @PostMapping(path = "/upload-multiple", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadJobDescriptions(@RequestParam("files") MultipartFile[] files) {
        try {
            // Get authenticated user (by email)
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUserEmail = authentication.getName();
            List<JobDescriptionDTO> jdDTOs = new ArrayList<>();
            for (MultipartFile file : files) {
                JobDescription savedJD = jobDescriptionService.store(file, currentUserEmail);

                JobDescriptionDTO jdDTO = new JobDescriptionDTO(
                        savedJD.getId(),
                        savedJD.getUser().getId(),
                        savedJD.getUser().getName(),
                        savedJD.getName(),
                        savedJD.getSize(),
                        savedJD.getType(),
                        savedJD.getUploadedAt()
                );
                jdDTOs.add(jdDTO);
            }

            List<FileDTO> jds = jdDTOs.stream().map(dto -> new FileDTO(dto.getId(), "jds")).toList();
            messagePublisherService.publish(channel, jds);

            return ResponseEntity.status(HttpStatus.CREATED).body(jdDTOs);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload job description: " + e.getMessage());
        }

    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<?> getJobDescription(@PathVariable Long id) {
        try {
            JobDescription jd = jobDescriptionService.getJobDescription(id);

            JobDescriptionDTO jdDTO = new JobDescriptionDTO(
                    jd.getId(),
                    jd.getUser().getId(),
                    jd.getUser().getName(),
                    jd.getName(),
                    jd.getSize(),
                    jd.getType(),
                    jd.getUploadedAt()
            );

            return ResponseEntity.ok(jdDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(path = "/download/{id}")
    public ResponseEntity<?> downloadJobDescription(@PathVariable Long id) {
        try {
            JobDescription jd = jobDescriptionService.getJobDescription(id);
            byte[] data = jobDescriptionService.getJobDescriptionData(id);

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + jd.getName() + "\"")
                    .contentType(MediaType.parseMediaType(jd.getType()))
                    .body(data);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
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

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<?> deleteJobDescription(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUserEmail = authentication.getName();

            jobDescriptionService.deleteJobDescription(id, currentUserEmail);
            return ResponseEntity.ok("Job description with id: " + id + " deleted successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete job description: " + e.getMessage());
        }
    }

    @DeleteMapping()
    public ResponseEntity<?> deleteAllCVs() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUserEmail = authentication.getName();

            jobDescriptionService.deleteAll(currentUserEmail);
            return ResponseEntity.ok("All JDs are deleted successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete CV: " + e.getMessage());
        }
    }


}
