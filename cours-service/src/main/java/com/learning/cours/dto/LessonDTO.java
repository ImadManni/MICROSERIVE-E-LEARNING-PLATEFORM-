package com.learning.cours.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonDTO {
    private String id;
    private String title;
    private String content;
    private Integer duration;
    private String courseId;
}
