package com.learning.statistique.repository;

import com.learning.statistique.entity.VideoStatistic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VideoStatisticRepository extends JpaRepository<VideoStatistic, Long> {
    List<VideoStatistic> findByCourseId(Long courseId);
    Optional<VideoStatistic> findTopByYoutubeVideoIdOrderByFetchedAtDesc(String youtubeVideoId);
}
