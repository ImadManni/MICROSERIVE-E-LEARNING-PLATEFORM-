package com.learning.statistique.repository;

import com.learning.statistique.entity.VideoStatistic;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VideoStatisticRepository extends MongoRepository<VideoStatistic, String> {
    List<VideoStatistic> findByCourseId(String courseId);
    
    @Query("{ 'youtubeVideoId': ?0 }")
    List<VideoStatistic> findByYoutubeVideoId(String youtubeVideoId);
    
    @Query(value = "{ 'youtubeVideoId': ?0 }", sort = "{ 'fetchedAt': -1 }")
    List<VideoStatistic> findByYoutubeVideoIdOrderByFetchedAtDesc(String youtubeVideoId);
    
    default Optional<VideoStatistic> findTopByYoutubeVideoIdOrderByFetchedAtDesc(String youtubeVideoId) {
        List<VideoStatistic> results = findByYoutubeVideoIdOrderByFetchedAtDesc(youtubeVideoId);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }
}
