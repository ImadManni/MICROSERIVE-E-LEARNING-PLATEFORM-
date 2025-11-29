package com.learning.cours.repository;

import com.learning.cours.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

@RepositoryRestResource(path = "courses")
public interface CourseRepository extends MongoRepository<Course, String> {
    
    @RestResource(path = "by-title")
    Page<Course> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    
    @RestResource(path = "by-category")
    Page<Course> findByCategoryId(String categoryId, Pageable pageable);
    
    @RestResource(path = "by-professor")
    Page<Course> findByProfessorId(String professorId, Pageable pageable);
    
    @Query("{ $or: [ " +
           "{ 'title': { $regex: ?0, $options: 'i' } }, " +
           "{ 'description': { $regex: ?0, $options: 'i' } }, " +
           "{ 'professor.fullName': { $regex: ?0, $options: 'i' } }, " +
           "{ 'category.name': { $regex: ?0, $options: 'i' } } " +
           "] }")
    @RestResource(path = "search")
    Page<Course> searchCourses(String keyword, Pageable pageable);
}
