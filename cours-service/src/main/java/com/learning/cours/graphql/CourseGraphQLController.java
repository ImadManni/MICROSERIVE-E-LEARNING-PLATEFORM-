package com.learning.cours.graphql;

import com.learning.cours.dto.CourseDTO;
import com.learning.cours.entity.Category;
import com.learning.cours.entity.Course;
import com.learning.cours.entity.Lesson;
import com.learning.cours.entity.Professor;
import com.learning.cours.repository.CourseRepository;
import com.learning.cours.repository.FirestoreCourseRepository;
import com.learning.cours.repository.LessonRepository;
import com.learning.cours.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class CourseGraphQLController {
    
    private final CourseRepository courseRepository;
    private final FirestoreCourseRepository firestoreCourseRepository;
    private final LessonRepository lessonRepository;
    private final CourseService courseService;

    @QueryMapping
    public Course course(@Argument String id) {
        return firestoreCourseRepository.findById(id)
                .orElse(courseRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Course not found")));
    }

    @QueryMapping
    public List<Course> courses() {
        // Always try Firestore first (primary data source)
        try {
            List<Course> firestoreCourses = firestoreCourseRepository.findAll();
            if (firestoreCourses != null && !firestoreCourses.isEmpty()) {
                return firestoreCourses;
            }
        } catch (Exception e) {
            // Log but continue to MongoDB fallback
            System.err.println("Firestore query failed: " + e.getMessage());
        }
        // Fallback to MongoDB if Firestore is empty or fails
        return courseRepository.findAll();
    }

    @SchemaMapping(typeName = "Course", field = "category")
    public Category category(Course course) {
        return course.getCategory();
    }

    @SchemaMapping(typeName = "Course", field = "professor")
    public Professor professor(Course course) {
        return course.getProfessor();
    }

    @SchemaMapping(typeName = "Course", field = "lessons")
    public List<Lesson> lessons(Course course) {
        return lessonRepository.findByCourseId(course.getId());
    }

    @SchemaMapping(typeName = "Course", field = "createdAt")
    public String createdAt(Course course) {
        return course.getCreatedAt() != null ? course.getCreatedAt().toString() : null;
    }

    @MutationMapping
    public Course createCourse(@Argument CourseInput input) {
        CourseDTO courseDTO = new CourseDTO();
        courseDTO.setTitle(input.getTitle());
        courseDTO.setDescription(input.getDescription());
        courseDTO.setCategoryId(input.getCategoryId());
        courseDTO.setProfessorId(input.getProfessorId());
        courseDTO.setYoutubeVideoId(input.getYoutubeVideoId());
        courseDTO.setPrice(input.getPrice());
        
        CourseDTO created = courseService.createCourse(courseDTO);
        return courseRepository.findById(created.getId()).orElseThrow();
    }
}
