package com.example.syncv.controller;

import com.example.syncv.model.dto.CVDTO;
import com.example.syncv.model.dto.InputDTO;
import com.example.syncv.model.dto.MatchRequestDTO;
import com.example.syncv.model.dto.MatchResponseDTO;
import com.example.syncv.model.entity.CV;
import com.example.syncv.service.CVService;
import com.example.syncv.service.JobDescriptionService;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/match")
public class MatchController {
    private final CVService cvService;
    private final JobDescriptionService jobDescriptionService;
    private final RestTemplate restTemplate;

    public MatchController(CVService cvService, JobDescriptionService jobDescriptionService, RestTemplate restTemplate) {
        this.cvService = cvService;
        this.jobDescriptionService = jobDescriptionService;
        this.restTemplate = restTemplate;
    }

    @GetMapping(path = "/cvs/{id}")
    public ResponseEntity<?> matchForCV(@PathVariable Long id, @RequestBody List<InputDTO> inputs) {
        try {

//            Long userId = cvService.getCV(id).getUser().getId();
//            MatchRequestDTO req = new MatchRequestDTO(id, userId, 1, inputs);

            // aici se face request de pe react pentru un cv
            // si se va returna un jd
            // se face un request la API-ul de la serverul de fastAPI care va returna un JSON cu id-ul jd si scor
            List<MatchResponseDTO> requestBody = new ArrayList<>();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<List<MatchResponseDTO>> requestEntity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<?> res = restTemplate.exchange(
                    "http://host.docker.internal:8080/api/test",
                    HttpMethod.GET,
                    requestEntity,
                    new ParameterizedTypeReference<List<MatchResponseDTO>>() {
                    }
            );

            return ResponseEntity.ok(res.getBody());
        } catch (RuntimeException e) {
            System.out.println(e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(path = "/jds/{id}")
    public ResponseEntity<?> matchForJD(@PathVariable Long id) {
        try {
            // aici se face request de ep react pentru jd-uri
            // se returneaza lista de jd-uri (dto momentan)
            // se face request la API-ul de la serverul de fastAPI care returneaza un JSON cu scor si id
            return ResponseEntity.ok("Asd");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
