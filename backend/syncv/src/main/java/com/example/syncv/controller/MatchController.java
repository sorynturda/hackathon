package com.example.syncv.controller;

import com.example.syncv.model.dto.InputDTO;
import com.example.syncv.model.dto.MatchRequestDTO;
import com.example.syncv.model.dto.fe_service.JDResponse;
import com.example.syncv.model.dto.ml_service.MatchResponseJDDTO;
import com.example.syncv.service.CVService;
import com.example.syncv.service.JobDescriptionService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
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

    @PostMapping(path = "/cvs/{id}")
    public ResponseEntity<?> matchForCV(@PathVariable Long id, @RequestBody List<InputDTO> inputs) {
        try {

//            Long userId = cvService.getCV(id).getUser().getId();
//            MatchRequestDTO req = new MatchRequestDTO(id, userId, 1, inputs);

            // aici se face request de pe react pentru un cv
            // si se va returna un jd
            // se face un request la API-ul de la serverul de fastAPI care va returna un JSON cu id-ul jd si scor
            MatchRequestDTO requestBody = new MatchRequestDTO(id, cvService.getCV(id).getUser().getId(), 5, inputs);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<MatchRequestDTO> requestEntity = new HttpEntity<>(requestBody, headers);

            ObjectMapper mapper = new ObjectMapper();
//            System.out.println("Request JSON: " + mapper.writeValueAsString(requestBody));
            ResponseEntity<?> res = restTemplate.exchange(
                    "http://backend-ml-service:7999/api/find_match/cv",
                    HttpMethod.POST,
                    requestEntity,
                    new ParameterizedTypeReference<List<MatchResponseJDDTO>>() {
                    }
            );
            List<JDResponse> resToFE = new ArrayList<>();
            for(MatchResponseJDDTO it : (ArrayList<MatchResponseJDDTO>) res.getBody()){
                resToFE.add(new JDResponse(
                        it.getJob_id(),
                        requestBody.getUserId(),
                        jobDescriptionService.getJobDescription(it.getJob_id()).getName(),
                        it.getSimilarity_score()
                ));
            }

            return ResponseEntity.ok(resToFE);
        } catch (RuntimeException e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
//        } catch (JsonProcessingException e) {
//            throw new RuntimeException(e);
        }
    }

    @GetMapping(path = "/jds/{id}")
    public ResponseEntity<?> matchForJD(@PathVariable Long id) {
        try {
            // aici se face request de ep react pentru jd-uri
            // se returneaza lista de jd-uri (dto momentan)
            // se face request la API-ul de la serverul de fastAPI care returneaza un JSON cu scor si id
            MatchRequestDTO requestBody = new MatchRequestDTO(id, jobDescriptionService.getJobDescription(id).getUser().getId(), 1, new ArrayList<>());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<MatchRequestDTO> requestEntity = new HttpEntity<>(requestBody, headers);

            ObjectMapper mapper = new ObjectMapper();
            System.out.println("Request JSON: " + mapper.writeValueAsString(requestBody));
            ResponseEntity<?> res = restTemplate.exchange(
                    "http://host.docker.internal:8080/api/test2",
                    HttpMethod.POST,
                    requestEntity,
                    new ParameterizedTypeReference<List<MatchResponseJDDTO>>() {
                    }
            );

            return ResponseEntity.ok(res.getBody());

        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
