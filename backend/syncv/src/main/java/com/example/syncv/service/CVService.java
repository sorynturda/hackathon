package com.example.syncv.service;

import com.example.syncv.model.entity.CV;
import com.example.syncv.repository.CVRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileReader;
import java.io.IOException;
import java.rmi.server.ExportException;

@Service
public class CVService {
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    private final CVRepository CVRepository;

    @Autowired
    public CVService (CVRepository CVRepository) {
        this.CVRepository = CVRepository;
    }

//    public CV store(MultipartFile file) throws IOException{
//        String fileName = file.getOriginalFilename();
//        if(CVRepository.findByName(fileName))
//            throw new IllegalArgumentException("CV with this name already exists!");
//        if(file.getSize() > MAX_FILE_SIZE)
//            throw new IllegalArgumentException("File is too large!");
//        CV cv = new CV();
//        cv.setName(fileName);
//        cv.setData(file.getBytes());
//        cv.setType(file.getContentType());
//        cv.setSize(cv.getSize());
//    }
}
