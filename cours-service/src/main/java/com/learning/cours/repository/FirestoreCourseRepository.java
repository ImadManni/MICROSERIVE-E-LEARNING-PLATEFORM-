package com.learning.cours.repository;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.cloud.FirestoreClient;
import com.learning.cours.entity.Category;
import com.learning.cours.entity.Course;
import com.learning.cours.entity.Professor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Repository
@Slf4j
public class FirestoreCourseRepository {

    private final CategoryRepository categoryRepository;
    private final ProfessorRepository professorRepository;
    private static final String COLLECTION_NAME = "courses";
    
    @Autowired(required = false)
    private FirebaseApp firebaseApp;
    
    public FirestoreCourseRepository(CategoryRepository categoryRepository, ProfessorRepository professorRepository) {
        this.categoryRepository = categoryRepository;
        this.professorRepository = professorRepository;
    }
    
    private Firestore getFirestore() {
        if (firebaseApp == null) {
            throw new IllegalStateException("Firebase is not initialized. Firestore integration is disabled.");
        }
        try {
            return FirestoreClient.getFirestore(firebaseApp);
        } catch (Exception e) {
            throw new IllegalStateException("Firebase is not properly initialized. Firestore integration is disabled.", e);
        }
    }

    public List<Course> findAll() {
        try {
            Firestore firestore = getFirestore();
            List<Course> courses = new ArrayList<>();
            firestore.collection(COLLECTION_NAME)
                    .get()
                    .get()
                    .getDocuments()
                    .forEach(document -> {
                        Course course = convertToCourse(document.getData(), document.getId());
                        if (course != null) {
                            courses.add(course);
                        }
                    });
            log.info("Found {} courses in Firestore", courses.size());
            return courses;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding all courses in Firestore", e);
            return new ArrayList<>();
        } catch (Exception e) {
            log.error("Firebase not initialized or Firestore error", e);
            return new ArrayList<>();
        }
    }

    public Optional<Course> findById(String id) {
        try {
            Firestore firestore = getFirestore();
            var document = firestore.collection(COLLECTION_NAME).document(id).get().get();
            if (document.exists()) {
                Course course = convertToCourse(document.getData(), document.getId());
                return Optional.ofNullable(course);
            }
            return Optional.empty();
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding course by ID in Firestore: {}", id, e);
            return Optional.empty();
        } catch (Exception e) {
            log.error("Firebase not initialized or Firestore error for ID: {}", id, e);
            return Optional.empty();
        }
    }

    private Course convertToCourse(java.util.Map<String, Object> data, String id) {
        try {
            Course course = new Course();
            course.setId(id);
            course.setTitle((String) data.getOrDefault("title", ""));
            course.setDescription((String) data.getOrDefault("description", ""));
            course.setYoutubeVideoId((String) data.getOrDefault("youtubeVideoId", ""));
            
            Object priceObj = data.get("price");
            if (priceObj != null) {
                if (priceObj instanceof Number) {
                    course.setPrice(BigDecimal.valueOf(((Number) priceObj).doubleValue()));
                } else if (priceObj instanceof String) {
                    course.setPrice(new BigDecimal((String) priceObj));
                }
            }
            
            Object createdAtObj = data.get("createdAt");
            if (createdAtObj != null) {
                if (createdAtObj instanceof com.google.cloud.Timestamp) {
                    course.setCreatedAt(((com.google.cloud.Timestamp) createdAtObj).toDate().toInstant()
                            .atZone(ZoneId.systemDefault()).toLocalDateTime());
                } else if (createdAtObj instanceof java.util.Date) {
                    course.setCreatedAt(((java.util.Date) createdAtObj).toInstant()
                            .atZone(ZoneId.systemDefault()).toLocalDateTime());
                }
            }
            
            Object categoryObj = data.get("category");
            if (categoryObj instanceof java.util.Map) {
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> categoryMap = (java.util.Map<String, Object>) categoryObj;
                Category category = new Category();
                category.setId((String) categoryMap.getOrDefault("id", ""));
                category.setName((String) categoryMap.getOrDefault("name", ""));
                category.setDescription((String) categoryMap.getOrDefault("description", ""));
                course.setCategory(category);
            } else {
                Object categoryIdObj = data.get("categoryId");
                if (categoryIdObj != null) {
                    String categoryId = categoryIdObj.toString();
                    categoryRepository.findById(categoryId).ifPresent(course::setCategory);
                } else {
                    // Create default category if missing
                    Category defaultCategory = new Category();
                    defaultCategory.setId("0");
                    defaultCategory.setName("Uncategorized");
                    course.setCategory(defaultCategory);
                }
            }
            
            Object professorObj = data.get("professor");
            if (professorObj instanceof java.util.Map) {
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> professorMap = (java.util.Map<String, Object>) professorObj;
                Professor professor = new Professor();
                professor.setId((String) professorMap.getOrDefault("id", ""));
                professor.setFullName((String) professorMap.getOrDefault("fullName", ""));
                professor.setEmail((String) professorMap.getOrDefault("email", ""));
                professor.setBio((String) professorMap.getOrDefault("bio", ""));
                professor.setAvatarUrl((String) professorMap.getOrDefault("avatarUrl", ""));
                course.setProfessor(professor);
            } else {
                Object professorIdObj = data.get("professorId");
                if (professorIdObj != null) {
                    String professorId = professorIdObj.toString();
                    professorRepository.findById(professorId).ifPresent(course::setProfessor);
                } else {
                    // Create default professor if missing
                    Professor defaultProfessor = new Professor();
                    defaultProfessor.setId("0");
                    defaultProfessor.setFullName("Unknown Professor");
                    defaultProfessor.setEmail("");
                    course.setProfessor(defaultProfessor);
                }
            }
            
            return course;
        } catch (Exception e) {
            log.error("Error converting Firestore data to Course: {}", e.getMessage(), e);
            return null;
        }
    }
}

