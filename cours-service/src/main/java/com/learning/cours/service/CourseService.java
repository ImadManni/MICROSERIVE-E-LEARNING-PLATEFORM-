package com.learning.cours.service;

import com.learning.cours.dto.CourseDTO;
import com.learning.cours.entity.Category;
import com.learning.cours.entity.Course;
import com.learning.cours.entity.Professor;
import com.learning.cours.exception.ResourceNotFoundException;
import com.learning.cours.mapper.CourseMapper;
import com.learning.cours.repository.CategoryRepository;
import com.learning.cours.repository.CourseRepository;
import com.learning.cours.repository.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CourseService {
    
    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final ProfessorRepository professorRepository;
    private final CourseMapper courseMapper;

    public Page<CourseDTO> getAllCourses(Pageable pageable) {
        log.info("Fetching all courses with pagination: {}", pageable);
        return courseRepository.findAll(pageable)
                .map(courseMapper::toDTO);
    }

    public CourseDTO getCourseById(String id) {
        log.info("Fetching course with id: {}", id);
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        return courseMapper.toDTO(course);
    }

    public CourseDTO createCourse(CourseDTO courseDTO) {
        log.info("Creating new course: {}", courseDTO.getTitle());
        
        Category category = categoryRepository.findById(courseDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        
        Professor professor = professorRepository.findById(courseDTO.getProfessorId())
                .orElseThrow(() -> new ResourceNotFoundException("Professor not found"));
        
        Course course = new Course();
        course.setTitle(courseDTO.getTitle());
        course.setDescription(courseDTO.getDescription());
        course.setCategory(category);
        course.setProfessor(professor);
        course.setYoutubeVideoId(courseDTO.getYoutubeVideoId());
        course.setPrice(courseDTO.getPrice());
        
        Course savedCourse = courseRepository.save(course);
        log.info("Course created successfully with id: {}", savedCourse.getId());
        
        return courseMapper.toDTO(savedCourse);
    }

    public CourseDTO updateCourse(String id, CourseDTO courseDTO) {
        log.info("Updating course with id: {}", id);
        
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        
        if (courseDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(courseDTO.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            course.setCategory(category);
        }
        
        if (courseDTO.getProfessorId() != null) {
            Professor professor = professorRepository.findById(courseDTO.getProfessorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Professor not found"));
            course.setProfessor(professor);
        }
        
        course.setTitle(courseDTO.getTitle());
        course.setDescription(courseDTO.getDescription());
        course.setYoutubeVideoId(courseDTO.getYoutubeVideoId());
        course.setPrice(courseDTO.getPrice());
        
        Course updatedCourse = courseRepository.save(course);
        log.info("Course updated successfully with id: {}", updatedCourse.getId());
        
        return courseMapper.toDTO(updatedCourse);
    }

    public void deleteCourse(String id) {
        log.info("Deleting course with id: {}", id);
        if (!courseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Course not found with id: " + id);
        }
        courseRepository.deleteById(id);
        log.info("Course deleted successfully with id: {}", id);
    }

    public Page<CourseDTO> searchCourses(String keyword, Pageable pageable) {
        log.info("Searching courses with keyword: {}", keyword);
        return courseRepository.searchCourses(keyword, pageable)
                .map(courseMapper::toDTO);
    }
}
