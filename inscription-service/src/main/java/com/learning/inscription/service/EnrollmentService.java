package com.learning.inscription.service;

import com.learning.inscription.dto.CourseDTO;
import com.learning.inscription.dto.EnrollmentDTO;
import com.learning.inscription.entity.Enrollment;
import com.learning.inscription.exception.BusinessException;
import com.learning.inscription.exception.ResourceNotFoundException;
import com.learning.inscription.feign.CoursServiceClient;
import com.learning.inscription.repository.EnrollmentRepository;
import com.learning.inscription.repository.StudentRepository;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EnrollmentService {
    
    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CoursServiceClient coursServiceClient;

    @Transactional
    public EnrollmentDTO enrollStudent(Long studentId, Long courseId) {
        log.info("Processing enrollment for student {} in course {}", studentId, courseId);
        
        // Verify student exists
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found with id: " + studentId);
        }
        
        // Verify course exists via Feign Client
        try {
            CourseDTO course = coursServiceClient.getCourseById(courseId);
            log.info("Course found: {}", course.getTitle());
        } catch (FeignException.NotFound e) {
            log.error("Course not found with id: {}", courseId);
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }
        
        // Check for duplicate enrollment
        if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            log.warn("Duplicate enrollment attempt for student {} in course {}", studentId, courseId);
            throw new BusinessException("Student is already enrolled in this course");
        }
        
        // Create enrollment
        Enrollment enrollment = new Enrollment();
        enrollment.setStudentId(studentId);
        enrollment.setCourseId(courseId);
        enrollment.setProgress(0);
        
        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        log.info("Enrollment created successfully with id: {}", savedEnrollment.getId());
        
        return convertToDTO(savedEnrollment);
    }

    @Transactional(readOnly = true)
    public List<EnrollmentDTO> getStudentEnrollments(Long studentId) {
        log.info("Fetching enrollments for student: {}", studentId);
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(studentId);
        return enrollments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public EnrollmentDTO updateProgress(Long enrollmentId, Integer progress) {
        log.info("Updating progress for enrollment {} to {}%", enrollmentId, progress);
        
        if (progress < 0 || progress > 100) {
            throw new BusinessException("Progress must be between 0 and 100");
        }
        
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));
        
        enrollment.setProgress(progress);
        Enrollment updatedEnrollment = enrollmentRepository.save(enrollment);
        
        log.info("Progress updated successfully for enrollment: {}", enrollmentId);
        return convertToDTO(updatedEnrollment);
    }

    @Transactional
    public void unenrollStudent(Long enrollmentId) {
        log.info("Unenrolling student with enrollment id: {}", enrollmentId);
        
        if (!enrollmentRepository.existsById(enrollmentId)) {
            throw new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId);
        }
        
        enrollmentRepository.deleteById(enrollmentId);
        log.info("Student unenrolled successfully");
    }

    private EnrollmentDTO convertToDTO(Enrollment enrollment) {
        EnrollmentDTO dto = new EnrollmentDTO();
        dto.setId(enrollment.getId());
        dto.setStudentId(enrollment.getStudentId());
        dto.setCourseId(enrollment.getCourseId());
        dto.setEnrollmentDate(enrollment.getEnrollmentDate());
        dto.setProgress(enrollment.getProgress());
        
        // Fetch course details
        try {
            CourseDTO course = coursServiceClient.getCourseById(enrollment.getCourseId());
            dto.setCourse(course);
        } catch (Exception e) {
            log.warn("Could not fetch course details for course id: {}", enrollment.getCourseId());
        }
        
        return dto;
    }
}
