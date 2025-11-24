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
        private String id; // For video details API
        private VideoId idObj; // For search API (id.videoId)
        private Snippet snippet;
        private Statistics statistics;
        
        // Helper method to get video ID
        public String getVideoId() {
            if (id != null) {
                return id;
            }
            if (idObj != null && idObj.getVideoId() != null) {
                return idObj.getVideoId();
            }
            return null;
        }
    }
    
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class VideoId {
        private String videoId;
        private String kind;
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
        private Thumbnail defaultThumb;
        private Thumbnail medium;
        private Thumbnail high;
        
        @com.fasterxml.jackson.annotation.JsonProperty("default")
        public void setDefaultThumb(Thumbnail defaultThumb) {
            this.defaultThumb = defaultThumb;
        }
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
