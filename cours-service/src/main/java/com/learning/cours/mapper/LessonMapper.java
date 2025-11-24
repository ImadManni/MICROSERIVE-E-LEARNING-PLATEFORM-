package com.learning.cours.mapper;

import com.learning.cours.dto.LessonDTO;
import com.learning.cours.entity.Lesson;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LessonMapper {
    
    @Mapping(target = "courseId", source = "course.id")
    LessonDTO toDTO(Lesson lesson);
    
    Lesson toEntity(LessonDTO lessonDTO);
}
