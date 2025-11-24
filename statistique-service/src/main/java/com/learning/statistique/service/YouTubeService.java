package com.learning.statistique.service;

import com.learning.statistique.dto.YouTubeVideoResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@RequiredArgsConstructor
@Slf4j
public class YouTubeService {

    private final WebClient webClient;

    @Value("${youtube.api.key}")
    private String apiKey;

    @Value("${youtube.api.base-url}")
    private String baseUrl;

    public YouTubeVideoResponse getVideoStatistics(String videoId) {
        log.info("Fetching YouTube statistics for video: {}", videoId);
        
        try {
            return webClient.get()
                    .uri(baseUrl + "/videos?part=snippet,statistics&id=" + videoId + "&key=" + apiKey)
                    .retrieve()
                    .bodyToMono(YouTubeVideoResponse.class)
                    .block();
        } catch (Exception e) {
            log.error("Error fetching YouTube statistics: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch YouTube statistics", e);
        }
    }

    public YouTubeVideoResponse searchEducationalVideos(String query, int maxResults) {
        log.info("Searching educational videos for query: {}", query);
        
        try {
            return webClient.get()
                    .uri(baseUrl + "/search?part=snippet&q=" + query + 
                         "&type=video&maxResults=" + maxResults + 
                         "&videoCategoryId=27&key=" + apiKey) // Category 27 = Education
                    .retrieve()
                    .bodyToMono(YouTubeVideoResponse.class)
                    .block();
        } catch (Exception e) {
            log.error("Error searching videos: {}", e.getMessage());
            throw new RuntimeException("Failed to search videos", e);
        }
    }
}
