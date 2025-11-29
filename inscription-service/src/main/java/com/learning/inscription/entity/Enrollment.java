package com.learning.inscription.entity;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Enrollment {
    private String id;

    @NotNull(message = "Student ID is required")
    private String studentId;

    @NotNull(message = "Course ID is required")
    private String courseId;

    private LocalDateTime enrollmentDate;

    @Min(0)
    @Max(100)
    private Integer progress = 0;
}
