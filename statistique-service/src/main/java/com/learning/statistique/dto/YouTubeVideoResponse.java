package com.learning.statistique.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class YouTubeVideoResponse {
    private List<Item> items;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Item {
        private String id;
        private Snippet snippet;
        private Statistics statistics;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Snippet {
        private String title;
        private String description;
        private Thumbnails thumbnails;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Thumbnails {
        private Thumbnail high;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Thumbnail {
        private String url;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Statistics {
        private String viewCount;
        private String likeCount;
        private String commentCount;
    }
}
