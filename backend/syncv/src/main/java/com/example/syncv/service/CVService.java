package com.example.syncv.service;

import com.example.syncv.model.dto.CVDTO;
import com.example.syncv.model.entity.CV;
import com.example.syncv.model.entity.User;
import com.example.syncv.repository.CVRepository;
import com.example.syncv.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;


//if something is wrong here, fix the problem here and in JobDescriptionService
@Service
public class CVService {
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    private final CVRepository cvRepository;
    private final UserRepository userRepository;

    @Autowired
    public CVService(CVRepository cvRepository, UserRepository userRepository) {
        this.cvRepository = cvRepository;
        this.userRepository = userRepository;
    }

    public CV store(MultipartFile file, String userEmail) throws IOException {
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


        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        CV cv = new CV();
        cv.setName(fileName);
        cv.setData(file.getBytes());
        cv.setType(fileType);
        cv.setSize(file.getSize());
        cv.setUploadedAt(LocalDateTime.now());
        cv.setUser(user);

        return cvRepository.save(cv);
    }

    public CV getCV(Long id) {
        return cvRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CV not found with id: " + id));
    }

    public byte[] getCVData(Long id) {
        CV cv = getCV(id);
        return cv.getData();
    }

    @Transactional
    public List<CVDTO> getAllCVsByUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));
        return user.getCvs().stream().map(
                cv ->
                        new CVDTO(
                                cv.getId(),
                                cv.getUser().getId(),
                                cv.getUser().getName(),
                                cv.getName(),
                                cv.getSize(),
                                cv.getType(),
                                cv.getUploadedAt()
                        )
        ).toList();
    }

    public void deleteCV(Long id, String userEmail) {
        CV cv = cvRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CV not found with id:" + id));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email:" + userEmail));

        if (!cv.getUser().getId().equals(user.getId()))
            throw new RuntimeException("You are not authorized to delete this file");
        cvRepository.delete(cv);
    }
}