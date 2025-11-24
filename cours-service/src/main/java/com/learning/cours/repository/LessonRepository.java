package com.learning.cours.repository;

import com.learning.cours.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import java.util.List;

@RepositoryRestResource(path = "lessons")
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    
    @RestResource(path = "by-course")
    List<Lesson> findByCourseId(Long courseId);
}
