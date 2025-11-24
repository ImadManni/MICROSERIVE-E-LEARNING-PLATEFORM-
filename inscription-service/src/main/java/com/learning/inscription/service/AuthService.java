package com.learning.inscription.service;

import com.learning.inscription.dto.AuthRequest;
import com.learning.inscription.dto.AuthResponse;
import com.learning.inscription.dto.RegisterRequest;
import com.learning.inscription.entity.Student;
import com.learning.inscription.exception.BusinessException;
import com.learning.inscription.repository.StudentRepository;
import com.learning.inscription.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new student with email: {}", request.getEmail());
        
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email already registered");
        }
        
        Student student = new Student();
        student.setFullName(request.getFullName());
        student.setEmail(request.getEmail());
        student.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        student.setRoles(Set.of("ROLE_STUDENT"));
        
        Student savedStudent = studentRepository.save(student);
        log.info("Student registered successfully with id: {}", savedStudent.getId());
        
        String token = jwtTokenProvider.generateToken(savedStudent.getEmail(), savedStudent.getRoles());
        
        return new AuthResponse(
                token,
                "Bearer",
                savedStudent.getId(),
                savedStudent.getEmail(),
                savedStudent.getFullName(),
                savedStudent.getRoles()
        );
    }

    @Transactional(readOnly = true)
    public AuthResponse login(AuthRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());
        
        Student student = studentRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException("Invalid email or password"));
        
        if (!passwordEncoder.matches(request.getPassword(), student.getPasswordHash())) {
            throw new BusinessException("Invalid email or password");
        }
        
        String token = jwtTokenProvider.generateToken(student.getEmail(), student.getRoles());
        log.info("Login successful for student: {}", student.getEmail());
        
        return new AuthResponse(
                token,
                "Bearer",
                student.getId(),
                student.getEmail(),
                student.getFullName(),
                student.getRoles()
        );
    }

    public AuthResponse refreshToken(String oldToken) {
        log.info("Refreshing token");
        
        if (!jwtTokenProvider.validateToken(oldToken)) {
            throw new BusinessException("Invalid token");
        }
        
        String email = jwtTokenProvider.getUsernameFromToken(oldToken);
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Student not found"));
        
        String newToken = jwtTokenProvider.generateToken(student.getEmail(), student.getRoles());
        
        return new AuthResponse(
                newToken,
                "Bearer",
                student.getId(),
                student.getEmail(),
                student.getFullName(),
                student.getRoles()
        );
    }
}
