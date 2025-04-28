package com.example.syncv.controller;

import com.example.syncv.model.dto.InputDTO;
import com.example.syncv.model.dto.MatchDTO;
import com.example.syncv.model.dto.MatchRequestDTO;
import com.example.syncv.model.dto.ml_service.MatchResponseCVDTO;
import com.example.syncv.model.dto.ml_service.MatchResponseJDDTO;
import com.example.syncv.model.entity.CV;
import com.example.syncv.model.entity.JobDescription;
import com.example.syncv.service.CVService;
import com.example.syncv.service.JobDescriptionService;
import com.example.syncv.service.MatchService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchController {
    private final CVService cvService;
    private final JobDescriptionService jobDescriptionService;
    private final RestTemplate restTemplate;
    private final MatchService matchService;

    public MatchController(CVService cvService, JobDescriptionService jobDescriptionService, RestTemplate restTemplate, MatchService matchService) {
        this.cvService = cvService;
        this.jobDescriptionService = jobDescriptionService;
        this.restTemplate = restTemplate;
        this.matchService = matchService;
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<?> getMatch(@PathVariable Long id) {
        try {
            MatchDTO match = matchService.getMatch(id);
            return ResponseEntity.ok(match);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }

    }

    @GetMapping
    public ResponseEntity<?> getAllMatches() {
        try {
            // Get authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUserEmail = authentication.getName();

            List<MatchDTO> matches = matchService.getAllMatchesByUser(currentUserEmail);


            return ResponseEntity.ok(matches);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }

    }

    @PostMapping(path = "/cvs/{cvId}")
    public ResponseEntity<?> matchForCV(@PathVariable Long cvId) {
        try {


            // aici se face request de pe react pentru un cv
            // si se va returna un jd
            // se face un request la API-ul de la serverul de fastAPI care va returna un JSON cu id-ul jd si scor
            CV cv = cvService.getCV(cvId);
            MatchRequestDTO requestBody = new MatchRequestDTO(cvId, cv.getUser().getId(), 1, new ArrayList<>());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<MatchRequestDTO> requestEntity = new HttpEntity<>(requestBody, headers);

            ObjectMapper mapper = new ObjectMapper();
//            System.out.println("Request JSON: " + mapper.writeValueAsString(requestBody));
            ResponseEntity<?> res = restTemplate.exchange(
                    "http://backend-ml-service:7999/api/find_match/cv",
                    HttpMethod.POST,
                    requestEntity,
                    new ParameterizedTypeReference<MatchResponseJDDTO>() {
                    }
            );
            matchService.storeMatchesJobs(
                    cv.getUser().getId(),
                    cvId,
                    (MatchResponseJDDTO) res.getBody()
            );


            return ResponseEntity.ok("Match done for cv with id: " + cvId);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
//        } catch (JsonProcessingException e) {
//            throw new RuntimeException(e);
        }
    }

    @PostMapping(path = "/jds/{jdId}")
    public ResponseEntity<?> matchForJD(@PathVariable Long jdId, @RequestBody List<InputDTO> inputs) {
        try {

            // aici se face request de ep react pentru jd-uri
            // se returneaza lista de jd-uri (dto momentan)
            // se face request la API-ul de la serverul de fastAPI care returneaza un JSON cu scor si id
            JobDescription jd = jobDescriptionService.getJobDescription(jdId);
            MatchRequestDTO requestBody = new MatchRequestDTO(jdId, jd.getUser().getId(), 5, inputs.stream().map(i -> new InputDTO(i.getSkill().trim(), i.getWeight())).toList());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<MatchRequestDTO> requestEntity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<?> res = restTemplate.exchange(
                    "http://backend-ml-service:7999/api/find_match/jd",
                    HttpMethod.POST,
                    requestEntity,
                    new ParameterizedTypeReference<MatchResponseCVDTO>() {
                    }
            );
            matchService.storeMatchesCandidates(jd.getUser().getId(), jdId, (MatchResponseCVDTO) res.getBody());

            return ResponseEntity.ok("Match done for jd with id: " + jdId);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping
    public ResponseEntity<?> deleteAllMatches() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUserEmail = authentication.getName();

            matchService.deleteAll(currentUserEmail);

            return ResponseEntity.ok("All matches are deleted successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete matches: " + e.getMessage());
        }
    }
}
