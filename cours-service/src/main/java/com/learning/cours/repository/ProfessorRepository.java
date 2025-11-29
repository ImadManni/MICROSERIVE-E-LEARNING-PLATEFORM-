package com.learning.cours.repository;

import com.learning.cours.entity.Professor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource(path = "professors")
public interface ProfessorRepository extends MongoRepository<Professor, String> {
    
    @RestResource(path = "by-email")
    Optional<Professor> findByEmail(String email);
    
    @RestResource(path = "by-name")
    List<Professor> findByFullNameContainingIgnoreCase(String name);
}
