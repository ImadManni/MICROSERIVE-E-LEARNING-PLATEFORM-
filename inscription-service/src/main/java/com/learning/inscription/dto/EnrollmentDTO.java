package com.learning.inscription.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentDTO {
    private String id;
    private String studentId;
    private String courseId;
    private LocalDateTime enrollmentDate;
    private Integer progress;
    private CourseDTO course;
}
