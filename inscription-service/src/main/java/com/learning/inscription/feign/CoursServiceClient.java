package com.learning.inscription.feign;

import com.learning.inscription.dto.CourseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "cours-service", path = "/api/courses")
public interface CoursServiceClient {
    
    @GetMapping("/{id}")
    CourseDTO getCourseById(@PathVariable String id);
}
