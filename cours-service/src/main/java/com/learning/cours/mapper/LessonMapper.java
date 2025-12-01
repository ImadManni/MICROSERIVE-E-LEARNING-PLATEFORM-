package com.learning.cours.mapper;

import com.learning.cours.dto.LessonDTO;
import com.learning.cours.entity.Lesson;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LessonMapper {
    
    LessonDTO toDTO(Lesson lesson);
    
    Lesson toEntity(LessonDTO lessonDTO);
}
