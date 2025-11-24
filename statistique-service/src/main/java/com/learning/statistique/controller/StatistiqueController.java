package com.learning.statistique.controller;

import com.learning.statistique.dto.VideoStatisticDTO;
import com.learning.statistique.dto.YouTubeVideoResponse;
import com.learning.statistique.service.StatistiqueService;
import com.learning.statistique.service.YouTubeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StatistiqueController {

    private final StatistiqueService statistiqueService;
    private final YouTubeService youTubeService;

    @PostMapping("/course/{courseId}")
    public ResponseEntity<VideoStatisticDTO> fetchStatistics(
            @PathVariable Long courseId,
            @RequestParam String youtubeVideoId) {
        VideoStatisticDTO stats = statistiqueService.fetchAndSaveStatistics(courseId, youtubeVideoId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<VideoStatisticDTO>> getCourseStatistics(@PathVariable Long courseId) {
        List<VideoStatisticDTO> stats = statistiqueService.getStatisticsByCourse(courseId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/video/{youtubeId}")
    public ResponseEntity<VideoStatisticDTO> getVideoStatistics(@PathVariable String youtubeId) {
        VideoStatisticDTO stats = statistiqueService.getLatestStatisticsByVideo(youtubeId);
        return stats != null ? ResponseEntity.ok(stats) : ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public ResponseEntity<YouTubeVideoResponse> searchVideos(
            @RequestParam String q,
            @RequestParam(defaultValue = "20") int maxResults) {
        YouTubeVideoResponse response = youTubeService.searchEducationalVideos(q, maxResults);
        return ResponseEntity.ok(response);
    }
}
