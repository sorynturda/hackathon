package com.example.syncv.service;

import com.example.syncv.model.dto.JobDescriptionDTO;
import com.example.syncv.model.entity.JobDescription;
import com.example.syncv.model.entity.User;
import com.example.syncv.repository.JDRepository;
import com.example.syncv.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class JDService {
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    private final JDRepository jdRepository;
    private final UserRepository userRepository;

    @Autowired
    public JDService(JDRepository jdRepository, UserRepository userRepository) {
        this.jdRepository = jdRepository;
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

        // doar pentru fisierele docx
        String fileType = file.getContentType();
        if (fileType == null || !fileType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
            throw new IllegalArgumentException("Only DOCX files are supported! Provided type: " + fileType);
        }

//        if(jdRepository.findByName(fileName))
//            throw new IllegalArgumentException("A file with this name already exists!");

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        JobDescription jobDescription = new JobDescription();
        jobDescription.setName(fileName);
        jobDescription.setData(file.getBytes());
        jobDescription.setType(fileType);
        jobDescription.setSize(file.getSize());
        jobDescription.setUploadedAt(LocalDateTime.now());
        jobDescription.setUser(user);

        return jdRepository.save(jobDescription);
    }

    public JobDescription getJobDescription(Long id) {
        return jdRepository.findById(id)
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
                                jd.getName(),
                                jd.getUser().getName(),
                                jd.getSize(),
                                jd.getType(),
                                jd.getUploadedAt(),
                                jd.getUser().getId(),
                                jd.getId()
                        )
        ).toList();
    }
}