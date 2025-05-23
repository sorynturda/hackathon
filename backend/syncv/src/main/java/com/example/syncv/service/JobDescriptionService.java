package com.example.syncv.service;

import com.example.syncv.model.dto.JobDescriptionDTO;
import com.example.syncv.model.entity.JobDescription;
import com.example.syncv.model.entity.User;
import com.example.syncv.repository.JobDescriptionRepository;
import com.example.syncv.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

// if something is broken here, fix the problem here and in CVService too
@Service
public class JobDescriptionService {
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    private final JobDescriptionRepository jobDescriptionRepository;
    private final UserRepository userRepository;

    @Autowired
    public JobDescriptionService(JobDescriptionRepository jobDescriptionRepository, UserRepository userRepository) {
        this.jobDescriptionRepository = jobDescriptionRepository;
        this.userRepository = userRepository;
    }

    public JobDescription store(MultipartFile file, String userEmail) throws IOException {
        String fileName = file.getOriginalFilename();

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File is too large! Maximum size is 5MB.");
        }

        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty!");
        }

        // doar pentru fisierele docx si pdf
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types/Common_types // pentru pdf si alte tipuri
        String fileType = file.getContentType();
        if (fileType == null ||
                (!fileType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document")
                        && !fileType.equals("application/pdf"))) {
            throw new IllegalArgumentException("Only DOCX and PDF files are supported! Provided type: " + fileType);
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        /// EDGE CASE: FILE MAY ALREADY EXIST ONLY IT IS UPLOADED BY THE SAME USER
        if (jobDescriptionRepository.findByUserIdAndName(user.getId(), fileName).isPresent())
            throw new IllegalArgumentException("File: " + fileName + " already exists!");


        JobDescription jobDescription = new JobDescription();
        jobDescription.setName(fileName);
        jobDescription.setData(file.getBytes());
        jobDescription.setType(fileType);
        jobDescription.setSize(file.getSize());
        jobDescription.setUploadedAt(LocalDateTime.now());
        jobDescription.setUser(user);

        return jobDescriptionRepository.save(jobDescription);
    }

    public JobDescription getJobDescription(Long id) {
        return jobDescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job Description not found with id: " + id));
    }

    public byte[] getJobDescriptionData(Long id) {
        JobDescription jd = getJobDescription(id);
        return jd.getData();
    }

    @Transactional
    public List<JobDescriptionDTO> getAllJobDescriptionsByUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));
        return user.getJobDescriptions().stream().map(
                jd ->
                        new JobDescriptionDTO(
                                jd.getId(),
                                jd.getUser().getId(),
                                jd.getUser().getName(),
                                jd.getName(),
                                jd.getSize(),
                                jd.getType(),
                                jd.getUploadedAt()
                        )
        ).toList();
    }

    public void deleteJobDescription(Long id, String userEmail) {
        JobDescription jobDescription = jobDescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job description not found with id:" + id));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        if (!jobDescription.getUser().getId().equals(user.getId()))
            throw new RuntimeException("You are not authorized to delete this Job Description");
        jobDescriptionRepository.delete(jobDescription);
    }

    public void deleteAll(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email:" + userEmail));
        jobDescriptionRepository.deleteAllByUser_Id(user.getId());
    }
}