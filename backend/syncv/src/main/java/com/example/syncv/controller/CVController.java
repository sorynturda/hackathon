package com.example.syncv.controller;

import com.example.syncv.model.dto.CVDTO;
import com.example.syncv.model.dto.FileDTO;
import com.example.syncv.model.entity.CV;
import com.example.syncv.service.CVService;
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

import javax.print.attribute.standard.Media;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/cvs")
public class CVController {
    private final CVService cvService;
    private final MessagePublisherService messagePublisherService;

    @Value("${redis.channel}")
    private String channel;

    @Autowired
    public CVController(CVService cvService, MessagePublisherService messagePublisherService) {
        this.cvService = cvService;
        this.messagePublisherService = messagePublisherService;
    }

    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
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
            List<FileDTO> cvs = new ArrayList<>();
            cvs.add(new FileDTO(cvDTO.getId(), "cvs", false));
            messagePublisherService.publish(channel, cvs);

            return ResponseEntity.status(HttpStatus.CREATED).body(cvDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload CV: " + e.getMessage());
        }
    }

    @PostMapping(path = "/upload-multiple", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadCVs(@RequestParam("files") MultipartFile[] files) {
        try {
            // Get authenticated user (by email)
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUserEmail = authentication.getName();

            List<CVDTO> cvDTOs = new ArrayList<>();

            for (MultipartFile file : files) {

                CV savedCV = cvService.store(file, currentUserEmail);

                CVDTO cvDTO = new CVDTO(
                        savedCV.getId(),
                        savedCV.getUser().getId(),
                        savedCV.getUser().getName(),
                        savedCV.getName(),
                        savedCV.getSize(),
                        savedCV.getType(),
                        savedCV.getUploadedAt()
                );
                cvDTOs.add(cvDTO);
            }

            List<FileDTO> cvs = cvDTOs.stream().map(dto -> new FileDTO(dto.getId(), "cvs", false)).toList();
            messagePublisherService.publish(channel, cvs);


            return ResponseEntity.status(HttpStatus.CREATED).body(cvDTOs);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload CVs: " + e.getMessage());
        }
    }

    @GetMapping(path = "/{id}")
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

    @GetMapping(path = "/download/{id}")
    public ResponseEntity<?> downloadCV(@PathVariable Long id) {
        try {
            CV cv = cvService.getCV(id);
            byte[] data = cvService.getCVData(id);

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + cv.getName() + "\"")
                    .contentType(MediaType.parseMediaType(cv.getType()))
                    .body(data);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
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

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<?> deleteCV(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUserEmail = authentication.getName();

            cvService.deleteCV(id, currentUserEmail);

            List<FileDTO> jds = new ArrayList<>();
            jds.add(new FileDTO(id, "cvs", true));
            messagePublisherService.publish(channel, jds);


            return ResponseEntity.ok("CV with id: " + id + " deleted successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete CV: " + e.getMessage());
        }

    }

    @DeleteMapping()
    public ResponseEntity<?> deleteAllCVs() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUserEmail = authentication.getName();

            List<FileDTO> jds = cvService.getAllCVsByUser(currentUserEmail).stream()
                    .map(cv ->
                            new FileDTO(
                                    cv.getId(),
                                    "cvs",
                                    true
                            ))
                    .toList();

            cvService.deleteAll(currentUserEmail);
            messagePublisherService.publish(channel, jds);
            return ResponseEntity.ok("All CVs are deleted successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete CVs: " + e.getMessage());
        }
    }

}
