package com.learning.inscription.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

@Configuration
@Slf4j
public class FirebaseConfig {

    @Value("${firebase.credentials.path:}")
    private String credentialsPath;

    @Value("${firebase.project-id:}")
    private String projectId;

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseOptions.Builder builder = FirebaseOptions.builder();

            if (credentialsPath != null && !credentialsPath.isEmpty()) {
                try (InputStream serviceAccount = new FileInputStream(credentialsPath)) {
                    GoogleCredentials credentials = GoogleCredentials.fromStream(serviceAccount);
                    builder.setCredentials(credentials);
                    log.info("Firebase initialized with service account from: {}", credentialsPath);
                }
            } else {
                GoogleCredentials credentials = GoogleCredentials.getApplicationDefault();
                builder.setCredentials(credentials);
                log.info("Firebase initialized with default application credentials");
            }

            if (projectId != null && !projectId.isEmpty()) {
                builder.setProjectId(projectId);
            }

            FirebaseOptions options = builder.build();
            FirebaseApp app = FirebaseApp.initializeApp(options);
            log.info("Firebase app initialized: {}", app.getName());
            return app;
        }
        return FirebaseApp.getInstance();
    }

    @Bean
    public FirebaseAuth firebaseAuth() throws IOException {
        return FirebaseAuth.getInstance(firebaseApp());
    }
}

