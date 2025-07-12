package com.swap_skill.swapskill.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.google.cloud.firestore.Firestore;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;

@Configuration
@Slf4j
public class FirebaseConfig {

    @Value("${firebase.project-id}")
    private String projectId;

    @Value("${firebase.service-account-key-path}")
    private String serviceAccountKeyPath;

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        if (FirebaseApp.getApps().isEmpty()) {
            try {
                InputStream serviceAccount = new ClassPathResource(serviceAccountKeyPath.replace("classpath:", "")).getInputStream();
                
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .setProjectId(projectId)
                        .build();

                FirebaseApp app = FirebaseApp.initializeApp(options);
                log.info("Firebase initialized successfully for project: {}", projectId);
                return app;
            } catch (IOException e) {
                log.error("Failed to initialize Firebase: {}", e.getMessage());
                throw e;
            }
        }
        return FirebaseApp.getInstance();
    }

    @Bean
    public Firestore firestore() throws IOException {
        log.info("Creating Firestore bean - this should only happen once during application startup");
        Firestore firestore = FirestoreClient.getFirestore(firebaseApp());
        log.info("Firestore bean created successfully");
        return firestore;
    }
} 