package com.example.syncv;

import com.example.syncv.model.entity.Role;
import com.example.syncv.repository.CVRepository;
import com.example.syncv.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Component;

@SpringBootApplication
public class SyncvApplication {

    public static void main(String[] args) {
        SpringApplication.run(SyncvApplication.class, args);
    }

    @Component
    public class DatabaseInitializer implements CommandLineRunner {

        @Autowired
        private RoleRepository roleRepository;

        @Override
        public void run(String... args) {
            if (roleRepository.count() == 0) {
                Role hrRole = new Role();
                hrRole.setName("ROLE_HR");
                roleRepository.save(hrRole);

                Role adminRole = new Role();
                adminRole.setName("ROLE_ADMIN");
                roleRepository.save(adminRole);

                System.out.println("Roles has been created.");
            }
        }
    }
}
