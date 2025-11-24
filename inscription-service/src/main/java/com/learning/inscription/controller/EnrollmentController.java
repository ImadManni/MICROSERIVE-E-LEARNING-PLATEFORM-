package com.learning.inscription.controller;

import com.learning.inscription.dto.EnrollmentDTO;
import com.learning.inscription.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EnrollmentController {
    
    private final EnrollmentService enrollmentService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<EnrollmentDTO> enrollStudent(
            @RequestParam Long studentId,
            @RequestParam Long courseId) {
        EnrollmentDTO enrollment = enrollmentService.enrollStudent(studentId, courseId);
        return ResponseEntity.status(HttpStatus.CREATED).body(enrollment);
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<List<EnrollmentDTO>> getStudentEnrollments(@PathVariable Long studentId) {
        List<EnrollmentDTO> enrollments = enrollmentService.getStudentEnrollments(studentId);
        return ResponseEntity.ok(enrollments);
    }

    @PutMapping("/{enrollmentId}/progress")
    @PreAuthorize("hasAnyRole('STUDENT', 'PROFESSOR', 'ADMIN')")
    public ResponseEntity<EnrollmentDTO> updateProgress(
            @PathVariable Long enrollmentId,
            @RequestParam Integer progress) {
        EnrollmentDTO enrollment = enrollmentService.updateProgress(enrollmentId, progress);
        return ResponseEntity.ok(enrollment);
    }

    @DeleteMapping("/{enrollmentId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<Void> unenrollStudent(@PathVariable Long enrollmentId) {
        enrollmentService.unenrollStudent(enrollmentId);
        return ResponseEntity.noContent().build();
    }
}
