package com.learning.inscription.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.learning.inscription.entity.Enrollment;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Repository
@Slf4j
public class FirebaseEnrollmentRepository {

    private static final String COLLECTION_NAME = "enrollments";

    private Firestore getFirestore() {
        return FirestoreClient.getFirestore();
    }

    public Enrollment save(Enrollment enrollment) {
        try {
            Firestore db = getFirestore();
            DocumentReference docRef;

            if (enrollment.getId() == null || enrollment.getId().isEmpty()) {
                docRef = db.collection(COLLECTION_NAME).document();
                enrollment.setId(docRef.getId());
            } else {
                docRef = db.collection(COLLECTION_NAME).document(enrollment.getId());
            }

            if (enrollment.getEnrollmentDate() == null) {
                enrollment.setEnrollmentDate(LocalDateTime.now());
            }

            Map<String, Object> data = new HashMap<>();
            data.put("id", enrollment.getId());
            data.put("studentId", enrollment.getStudentId());
            data.put("courseId", enrollment.getCourseId());
            data.put("enrollmentDate", Date.from(enrollment.getEnrollmentDate().atZone(ZoneId.systemDefault()).toInstant()));
            data.put("progress", enrollment.getProgress() != null ? enrollment.getProgress() : 0);

            ApiFuture<WriteResult> result = docRef.set(data);
            result.get();
            log.info("Enrollment saved to Firestore with id: {}", enrollment.getId());
            return enrollment;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error saving enrollment to Firestore", e);
            throw new RuntimeException("Failed to save enrollment", e);
        }
    }

    public List<Enrollment> findByStudentId(String studentId) {
        try {
            Firestore db = getFirestore();
            Query query = db.collection(COLLECTION_NAME).whereEqualTo("studentId", studentId);
            ApiFuture<QuerySnapshot> querySnapshot = query.get();
            QuerySnapshot snapshot = querySnapshot.get();
            return snapshot.getDocuments().stream()
                    .map(this::documentToEnrollment)
                    .collect(Collectors.toList());
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding enrollments by studentId: {}", studentId, e);
            return new ArrayList<>();
        }
    }

    public List<Enrollment> findByCourseId(String courseId) {
        try {
            Firestore db = getFirestore();
            Query query = db.collection(COLLECTION_NAME).whereEqualTo("courseId", courseId);
            ApiFuture<QuerySnapshot> querySnapshot = query.get();
            QuerySnapshot snapshot = querySnapshot.get();
            return snapshot.getDocuments().stream()
                    .map(this::documentToEnrollment)
                    .collect(Collectors.toList());
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding enrollments by courseId: {}", courseId, e);
            return new ArrayList<>();
        }
    }

    public Optional<Enrollment> findByStudentIdAndCourseId(String studentId, String courseId) {
        try {
            Firestore db = getFirestore();
            Query query = db.collection(COLLECTION_NAME)
                    .whereEqualTo("studentId", studentId)
                    .whereEqualTo("courseId", courseId)
                    .limit(1);
            ApiFuture<QuerySnapshot> querySnapshot = query.get();
            QuerySnapshot snapshot = querySnapshot.get();
            if (snapshot.isEmpty()) {
                return Optional.empty();
            }
            return Optional.of(documentToEnrollment(snapshot.getDocuments().get(0)));
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding enrollment by studentId and courseId", e);
            return Optional.empty();
        }
    }

    public boolean existsByStudentIdAndCourseId(String studentId, String courseId) {
        return findByStudentIdAndCourseId(studentId, courseId).isPresent();
    }

    public Optional<Enrollment> findById(String id) {
        try {
            Firestore db = getFirestore();
            DocumentReference docRef = db.collection(COLLECTION_NAME).document(id);
            ApiFuture<DocumentSnapshot> future = docRef.get();
            DocumentSnapshot document = future.get();

            if (document.exists()) {
                return Optional.of(documentToEnrollment(document));
            }
            return Optional.empty();
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding enrollment by id: {}", id, e);
            return Optional.empty();
        }
    }

    public boolean existsById(String id) {
        return findById(id).isPresent();
    }

    public void deleteById(String id) {
        try {
            Firestore db = getFirestore();
            ApiFuture<WriteResult> result = db.collection(COLLECTION_NAME).document(id).delete();
            result.get();
            log.info("Enrollment deleted from Firestore with id: {}", id);
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error deleting enrollment with id: {}", id, e);
            throw new RuntimeException("Failed to delete enrollment", e);
        }
    }

    private Enrollment documentToEnrollment(DocumentSnapshot document) {
        Enrollment enrollment = new Enrollment();
        enrollment.setId(document.getId());
        enrollment.setStudentId(document.getString("studentId"));
        enrollment.setCourseId(document.getString("courseId"));
        enrollment.setProgress(document.getLong("progress") != null ? document.getLong("progress").intValue() : 0);

        Date enrollmentDate = document.getDate("enrollmentDate");
        if (enrollmentDate != null) {
            enrollment.setEnrollmentDate(LocalDateTime.ofInstant(enrollmentDate.toInstant(), ZoneId.systemDefault()));
        }

        return enrollment;
    }
}

