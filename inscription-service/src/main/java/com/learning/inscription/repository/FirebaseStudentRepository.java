package com.learning.inscription.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.learning.inscription.entity.Student;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.concurrent.ExecutionException;

@Repository
@Slf4j
public class FirebaseStudentRepository {

    private static final String COLLECTION_NAME = "students";

    private Firestore getFirestore() {
        return FirestoreClient.getFirestore();
    }

    public Student save(Student student) {
        try {
            Firestore db = getFirestore();
            DocumentReference docRef;

            if (student.getId() == null || student.getId().isEmpty()) {
                docRef = db.collection(COLLECTION_NAME).document();
                student.setId(docRef.getId());
            } else {
                docRef = db.collection(COLLECTION_NAME).document(student.getId());
            }

            if (student.getCreatedAt() == null) {
                student.setCreatedAt(LocalDateTime.now());
            }

            Map<String, Object> data = new HashMap<>();
            data.put("id", student.getId());
            data.put("fullName", student.getFullName());
            data.put("email", student.getEmail());
            data.put("passwordHash", student.getPasswordHash());
            data.put("createdAt", Date.from(student.getCreatedAt().atZone(ZoneId.systemDefault()).toInstant()));
            data.put("roles", student.getRoles() != null ? new ArrayList<>(student.getRoles()) : new ArrayList<>());

            ApiFuture<WriteResult> result = docRef.set(data);
            result.get();
            log.info("Student saved to Firestore with id: {}", student.getId());
            return student;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error saving student to Firestore", e);
            throw new RuntimeException("Failed to save student", e);
        }
    }

    public Optional<Student> findByEmail(String email) {
        try {
            Firestore db = getFirestore();
            CollectionReference students = db.collection(COLLECTION_NAME);
            Query query = students.whereEqualTo("email", email).limit(1);
            ApiFuture<QuerySnapshot> querySnapshot = query.get();

            QuerySnapshot snapshot = querySnapshot.get();
            if (snapshot.isEmpty()) {
                return Optional.empty();
            }

            DocumentSnapshot document = snapshot.getDocuments().get(0);
            return Optional.of(documentToStudent(document));
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding student by email: {}", email, e);
            return Optional.empty();
        }
    }

    public boolean existsByEmail(String email) {
        return findByEmail(email).isPresent();
    }

    public boolean existsById(String id) {
        return findById(id).isPresent();
    }

    public Optional<Student> findById(String id) {
        try {
            Firestore db = getFirestore();
            DocumentReference docRef = db.collection(COLLECTION_NAME).document(id);
            ApiFuture<DocumentSnapshot> future = docRef.get();
            DocumentSnapshot document = future.get();

            if (document.exists()) {
                return Optional.of(documentToStudent(document));
            }
            return Optional.empty();
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding student by id: {}", id, e);
            return Optional.empty();
        }
    }

    private Student documentToStudent(DocumentSnapshot document) {
        Student student = new Student();
        student.setId(document.getId());
        student.setFullName(document.getString("fullName"));
        student.setEmail(document.getString("email"));
        student.setPasswordHash(document.getString("passwordHash"));

        Date createdAt = document.getDate("createdAt");
        if (createdAt != null) {
            student.setCreatedAt(LocalDateTime.ofInstant(createdAt.toInstant(), ZoneId.systemDefault()));
        }

        List<String> rolesList = (List<String>) document.get("roles");
        if (rolesList != null) {
            student.setRoles(new HashSet<>(rolesList));
        } else {
            student.setRoles(new HashSet<>());
        }

        return student;
    }
}

