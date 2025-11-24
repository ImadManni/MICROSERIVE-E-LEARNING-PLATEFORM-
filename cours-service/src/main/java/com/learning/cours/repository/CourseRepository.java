package com.learning.cours.repository;

import com.learning.cours.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import java.util.List;

@RepositoryRestResource(path = "courses")
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    @RestResource(path = "by-title")
    Page<Course> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    
    @RestResource(path = "by-category")
    Page<Course> findByCategoryId(Long categoryId, Pageable pageable);
    
    @RestResource(path = "by-professor")
    Page<Course> findByProfessorId(Long professorId, Pageable pageable);
    
    @Query("SELECT c FROM Course c WHERE " +
           "LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.professor.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.category.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    @RestResource(path = "search")
    Page<Course> searchCourses(@Param("keyword") String keyword, Pageable pageable);
}
