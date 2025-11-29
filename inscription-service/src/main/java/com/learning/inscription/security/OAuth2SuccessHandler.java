package com.learning.inscription.security;

import com.learning.inscription.entity.Student;
import com.learning.inscription.repository.FirebaseStudentRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final FirebaseStudentRepository studentRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        
        // Extract user information from OAuth2
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        
        log.info("OAuth2 login successful for: {}", email);
        
        if (email == null || name == null) {
            log.error("Missing email or name from OAuth2 user");
            getRedirectStrategy().sendRedirect(request, response, "/login?error=oauth2_missing_info");
            return;
        }
        
        // Find or create student
        Student student = studentRepository.findByEmail(email)
                .orElseGet(() -> {
                    log.info("Creating new student from OAuth2: {}", email);
                    Student newStudent = new Student();
                    newStudent.setEmail(email);
                    newStudent.setFullName(name);
                    // Generate a random password hash for OAuth users (they won't use it)
                    newStudent.setPasswordHash("$2a$10$OAUTH2_USER_NO_PASSWORD_REQUIRED");
                    newStudent.setRoles(Set.of("ROLE_STUDENT"));
                    return studentRepository.save(newStudent);
                });
        
        // Generate JWT token
        String token = jwtTokenProvider.generateToken(student.getEmail(), student.getRoles());
        
        log.info("OAuth2 authentication successful, redirecting with token");
        
        // Redirect to frontend with token
        String redirectUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/auth/callback")
                .queryParam("token", URLEncoder.encode(token, StandardCharsets.UTF_8))
                .queryParam("email", URLEncoder.encode(student.getEmail(), StandardCharsets.UTF_8))
                .queryParam("name", URLEncoder.encode(student.getFullName(), StandardCharsets.UTF_8))
                .queryParam("id", student.getId())
                .build()
                .toUriString();
        
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}

