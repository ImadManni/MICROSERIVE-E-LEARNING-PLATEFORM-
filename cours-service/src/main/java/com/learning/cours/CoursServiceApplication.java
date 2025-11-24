package com.learning.cours;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class CoursServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(CoursServiceApplication.class, args);
    }
}
