package com.example.syncv.controller;

import com.example.syncv.model.dto.CVDTO;
import com.example.syncv.model.dto.JobDescriptionDTO;
import com.example.syncv.model.dto.MatchDTO;
import com.example.syncv.model.entity.CV;
import com.example.syncv.service.CVService;
import com.example.syncv.service.JobDescriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/match")
public class MatchController {
    private final CVService cvService;
    private final JobDescriptionService jobDescriptionService;
    public MatchController(CVService cvService, JobDescriptionService jobDescriptionService) {
        this.cvService = cvService;
        this.jobDescriptionService = jobDescriptionService;
    }

    @GetMapping(path = "/cvs/{id}")
    public ResponseEntity<?> matchForCV(@PathVariable Long id) {
        try {
            CV cv = cvService.getCV(id);

            CVDTO res = new CVDTO(
                    cv.getId(),
                    cv.getUser().getId(),
                    cv.getUser().getName(),
                    cv.getName(),
                    cv.getSize(),
                    cv.getType(),
                    cv.getUploadedAt()
            );
            // aici se face request de pe react pentru un cv
            // si se va returna un jd
            // se face un request la API-ul de la serverul de fastAPI care va returna un JSON cu id-ul jd si scor

            return ResponseEntity.ok(res);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping(path = "/jds/{id}")
    public ResponseEntity<?> matchForJD(@PathVariable Long id){
        try{
            // aici se face request de ep react pentru jd-uri
            // se returneaza lista de jd-uri (dto momentan)
            // se face request la API-ul de la serverul de fastAPI care returneaza un JSON cu scor si id
            return ResponseEntity.ok("Asd");
        }
        catch (RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }
}
