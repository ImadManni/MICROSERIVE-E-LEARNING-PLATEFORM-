package com.learning.statistique.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "video_statistics")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VideoStatistic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long courseId;

    @Column(nullable = false)
    private String youtubeVideoId;

    private Long views;
    private Long likes;
    private Long comments;
    private String title;
    private String description;
    private String thumbnailUrl;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime fetchedAt;
}
