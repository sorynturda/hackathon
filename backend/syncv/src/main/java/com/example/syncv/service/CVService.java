package com.example.syncv.service;

import com.example.syncv.model.entity.CVEntity;
import com.example.syncv.repository.CVRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class CVService {
    private final CVRepository cvRepository;

    @Autowired
    public CVService(CVRepository cvRepository){
        this.cvRepository = cvRepository;
    }

    public CVEntity storeCV(MultipartFile file){
        return null;
    };
}
