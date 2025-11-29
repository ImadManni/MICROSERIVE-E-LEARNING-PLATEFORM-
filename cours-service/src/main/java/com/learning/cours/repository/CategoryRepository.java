package com.learning.cours.repository;

import com.learning.cours.entity.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import java.util.List;

@RepositoryRestResource(path = "categories")
public interface CategoryRepository extends MongoRepository<Category, String> {
    
    @RestResource(path = "by-name")
    List<Category> findByNameContainingIgnoreCase(String name);
}
