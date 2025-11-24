package com.learning.statistique.controller;

import com.learning.statistique.dto.VideoStatisticDTO;
import com.learning.statistique.service.StatistiqueService;
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
}
