package com.learning.cours.graphql;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CourseInput {
    private String title;
    private String description;
    private String categoryId;
    private String professorId;
    private String youtubeVideoId;
    private BigDecimal price;
}
