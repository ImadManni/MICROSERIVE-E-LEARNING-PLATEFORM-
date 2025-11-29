package com.learning.statistique.service;

import com.learning.statistique.dto.VideoStatisticDTO;
import com.learning.statistique.dto.YouTubeVideoResponse;
import com.learning.statistique.entity.VideoStatistic;
import com.learning.statistique.repository.VideoStatisticRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StatistiqueService {

    private final VideoStatisticRepository statisticRepository;
    private final YouTubeService youTubeService;

    public VideoStatisticDTO fetchAndSaveStatistics(String courseId, String youtubeVideoId) {
        log.info("Fetching statistics for course {} with YouTube video {}", courseId, youtubeVideoId);
        
        YouTubeVideoResponse response = youTubeService.getVideoStatistics(youtubeVideoId);
        
        if (response.getItems() == null || response.getItems().isEmpty()) {
            throw new RuntimeException("YouTube video not found");
        }
        
        YouTubeVideoResponse.Item item = response.getItems().get(0);
        
        VideoStatistic statistic = new VideoStatistic();
        statistic.setCourseId(courseId);
        statistic.setYoutubeVideoId(youtubeVideoId);
        statistic.setTitle(item.getSnippet().getTitle());
        statistic.setDescription(item.getSnippet().getDescription());
        
        if (item.getSnippet().getThumbnails() != null && 
            item.getSnippet().getThumbnails().getHigh() != null) {
            statistic.setThumbnailUrl(item.getSnippet().getThumbnails().getHigh().getUrl());
        }
        
        if (item.getStatistics() != null) {
            statistic.setViews(parseLong(item.getStatistics().getViewCount()));
            statistic.setLikes(parseLong(item.getStatistics().getLikeCount()));
            statistic.setComments(parseLong(item.getStatistics().getCommentCount()));
        }
        
        VideoStatistic saved = statisticRepository.save(statistic);
        log.info("Statistics saved successfully for video: {}", youtubeVideoId);
        
        return convertToDTO(saved);
    }

    public List<VideoStatisticDTO> getStatisticsByCourse(String courseId) {
        log.info("Fetching statistics for course: {}", courseId);
        return statisticRepository.findByCourseId(courseId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public VideoStatisticDTO getLatestStatisticsByVideo(String youtubeVideoId) {
        log.info("Fetching latest statistics for video: {}", youtubeVideoId);
        return statisticRepository.findTopByYoutubeVideoIdOrderByFetchedAtDesc(youtubeVideoId)
                .map(this::convertToDTO)
                .orElse(null);
    }

    private VideoStatisticDTO convertToDTO(VideoStatistic statistic) {
        VideoStatisticDTO dto = new VideoStatisticDTO();
        dto.setId(statistic.getId());
        dto.setCourseId(statistic.getCourseId());
        dto.setYoutubeVideoId(statistic.getYoutubeVideoId());
        dto.setViews(statistic.getViews());
        dto.setLikes(statistic.getLikes());
        dto.setComments(statistic.getComments());
        dto.setTitle(statistic.getTitle());
        dto.setDescription(statistic.getDescription());
        dto.setThumbnailUrl(statistic.getThumbnailUrl());
        dto.setFetchedAt(statistic.getFetchedAt());
        return dto;
    }

    private Long parseLong(String value) {
        try {
            return value != null ? Long.parseLong(value) : 0L;
        } catch (NumberFormatException e) {
            return 0L;
        }
    }
}
