package com.learning.statistique.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "video_statistics")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VideoStatistic {
    @Id
    private String id;

    private String courseId;

    private String youtubeVideoId;

    private Long views;
    private Long likes;
    private Long comments;
    private String title;
    private String description;
    private String thumbnailUrl;

    @CreatedDate
    private LocalDateTime fetchedAt;
}
