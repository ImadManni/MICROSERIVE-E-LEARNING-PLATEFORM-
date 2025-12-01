package com.learning.cours.mapper;

import com.learning.cours.dto.CourseDTO;
import com.learning.cours.entity.Course;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CourseMapper {
    
    default CourseDTO toDTO(Course course) {
        if (course == null) {
            return null;
        }
        
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setYoutubeVideoId(course.getYoutubeVideoId());
        dto.setPrice(course.getPrice());
        dto.setCreatedAt(course.getCreatedAt());
        
        if (course.getCategory() != null) {
            dto.setCategoryId(course.getCategory().getId());
            dto.setCategoryName(course.getCategory().getName());
        }
        
        if (course.getProfessor() != null) {
            dto.setProfessorId(course.getProfessor().getId());
            dto.setProfessorName(course.getProfessor().getFullName());
        }
        
        if (course.getLessons() != null) {
            dto.setLessonsCount(course.getLessons().size());
        } else {
            dto.setLessonsCount(0);
        }
        
        return dto;
    }
    
    Course toEntity(CourseDTO courseDTO);
}
