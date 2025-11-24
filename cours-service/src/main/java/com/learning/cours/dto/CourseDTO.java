package com.learning.cours.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {
    private Long id;
    private String title;
    private String description;
    private Long categoryId;
    private String categoryName;
    private Long professorId;
    private String professorName;
    private String youtubeVideoId;
    private BigDecimal price;
    private LocalDateTime createdAt;
    private Integer lessonsCount;
}
