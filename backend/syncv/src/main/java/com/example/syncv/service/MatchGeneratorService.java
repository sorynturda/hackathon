package com.example.syncv.service;

import com.example.syncv.model.dto.ml_service.CandidateDTO;
import com.example.syncv.model.dto.ml_service.JobDTO;
import com.example.syncv.model.dto.ml_service.MatchResponseCVDTO;
import com.example.syncv.model.dto.ml_service.MatchResponseJDDTO;
import com.example.syncv.model.entity.CV;
import com.example.syncv.model.entity.JobDescription;
import com.example.syncv.model.entity.Match;
import com.example.syncv.model.entity.User;
import com.example.syncv.repository.CVRepository;
import com.example.syncv.repository.JobDescriptionRepository;
import com.example.syncv.repository.MatchRepository;
import com.example.syncv.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class MatchGeneratorService {

    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final CVRepository cvRepository;
    private final JobDescriptionRepository jobDescriptionRepository;

    @Autowired
    public MatchGeneratorService(
            MatchRepository matchRepository,
            UserRepository userRepository,
            CVRepository cvRepository,
            JobDescriptionRepository jobDescriptionRepository) {
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
        this.cvRepository = cvRepository;
        this.jobDescriptionRepository = jobDescriptionRepository;
    }

    /**
     * Generates and stores 5 sample matches in the database
     * @return List of generated Match entities
     */
    @Transactional
    public List<Match> generateSampleMatches() {
        List<Match> generatedMatches = new ArrayList<>();

        // Get a random user to associate the matches with
        List<User> users = userRepository.findAll();
        if (users.isEmpty()) {
            throw new RuntimeException("No users found in the database. Please create users first.");
        }

        User randomUser = users.get(new Random().nextInt(users.size()));

        // Get CV and JD data
        List<CV> cvs = new ArrayList<>(randomUser.getCvs());
        List<JobDescription> jds = new ArrayList<>(randomUser.getJobDescriptions());

        if (cvs.isEmpty() || jds.isEmpty()) {
            throw new RuntimeException("User must have at least one CV and one Job Description to generate matches.");
        }

        // Sample skill sets
        String[][] matchingSkillSets = {
            {"Java", "Spring Boot", "REST_API", "SQL"},
            {"Python", "Data_Analysis", "Machine_Learning", "TensorFlow"},
            {"JavaScript", "React", "Node.js", "MongoDB"},
            {"C#", ".NET", "Azure", "SQL Server"},
            {"DevOps", "Docker", "Kubernetes", "AWS"}
        };

        String[][] missingSkillSets = {
            {"Kafka", "Microservices", "GraphQL"},
            {"PyTorch", "Computer_Vision", "NLP"},
            {"Angular", "Vue.js", "TypeScript"},
            {"Entity_Framework_Bossman", "Blazor", "Azure_Functions"},
            {"Terraform", "Jenkins", "Ansible"}
        };

        String[] positions = {
            "Java Developer",
            "Data Scientist",
            "Full-Stack Developer",
            ".NET Developer",
            "DevOps Engineer"
        };

        // Generate 5 matches
        for (int i = 0; i < 5; i++) {
            Match match = new Match();

            // Get random CV and JD
            CV cv = cvs.get(i % cvs.size());
            JobDescription jd = jds.get(i % jds.size());

            // Generate sample match data
            match.setCvId(cv.getId());
            match.setJdId(jd.getId());
            match.setCandidateName(cv.getUser().getName());
            match.setPosition(positions[i % positions.length]);

            // Generate a random score between 60 and 95
            double score = 60.0 + ThreadLocalRandom.current().nextDouble(0, 35.0);
            match.setScore(Math.round(score * 100.0) / 100.0); // Round to 2 decimal places

            match.setMatchDate(LocalDateTime.now());
            match.setUserId(randomUser.getId());
            match.setUserEmail(randomUser.getEmail());
            match.setReasoning("aici e reasoning blabla bla bla");

            // Set matching and missing skills
            match.setMatchingSkills(String.join(" ", matchingSkillSets[i % matchingSkillSets.length]));
            match.setMissingSkills(String.join(" ", missingSkillSets[i % missingSkillSets.length]));

            // Save the match
            Match savedMatch = matchRepository.save(match);
            generatedMatches.add(savedMatch);
        }

        return generatedMatches;
    }
}