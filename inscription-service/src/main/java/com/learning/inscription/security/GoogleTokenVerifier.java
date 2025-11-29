package com.learning.inscription.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.learning.inscription.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class GoogleTokenVerifier {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final String GOOGLE_TOKEN_INFO_URL = "https://oauth2.googleapis.com/tokeninfo?id_token=";

    public Map<String, String> verify(String token) {
        try {
            String url = GOOGLE_TOKEN_INFO_URL + token;
            String response = restTemplate.getForObject(url, String.class);

            JsonNode root = objectMapper.readTree(response);

            if (root.has("error")) {
                throw new BusinessException("Invalid Google token: " + root.get("error_description").asText());
            }

            Map<String, String> userInfo = new HashMap<>();
            userInfo.put("email", root.get("email").asText());
            userInfo.put("name", root.has("name") ? root.get("name").asText() : "");
            userInfo.put("picture", root.has("picture") ? root.get("picture").asText() : "");

            return userInfo;
        } catch (Exception e) {
            log.error("Error verifying Google token", e);
            throw new BusinessException("Failed to verify Google token");
        }
    }
}
