package com.learning.statistique.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VideoStatisticDTO {
    private String id;
    private String courseId;
    private String youtubeVideoId;
    private Long views;
    private Long likes;
    private Long comments;
    private String title;
    private String description;
    private String thumbnailUrl;
    private LocalDateTime fetchedAt;
}
