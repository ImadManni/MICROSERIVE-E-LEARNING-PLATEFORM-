package com.learning.cours.repository;

import com.learning.cours.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import java.util.List;

@RepositoryRestResource(path = "categories")
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    @RestResource(path = "by-name")
    List<Category> findByNameContainingIgnoreCase(String name);
}
