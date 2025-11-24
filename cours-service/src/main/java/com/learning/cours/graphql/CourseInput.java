package com.learning.cours.graphql;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CourseInput {
    private String title;
    private String description;
    private Long categoryId;
    private Long professorId;
    private String youtubeVideoId;
    private BigDecimal price;
}
