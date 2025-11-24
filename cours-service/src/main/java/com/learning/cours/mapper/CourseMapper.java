package com.learning.cours.mapper;

import com.learning.cours.dto.CourseDTO;
import com.learning.cours.entity.Course;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CourseMapper {
    
    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "professorId", source = "professor.id")
    @Mapping(target = "professorName", source = "professor.fullName")
    @Mapping(target = "lessonsCount", expression = "java(course.getLessons().size())")
    CourseDTO toDTO(Course course);
    
    Course toEntity(CourseDTO courseDTO);
}
