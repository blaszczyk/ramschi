package com.github.blaszczyk.ramschi.ramschi_server.service;

import com.github.blaszczyk.ramschi.ramschi_server.domain.Category;
import com.github.blaszczyk.ramschi.ramschi_server.persistence.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public Mono<List<Category>> getAllCategories() {
        return categoryRepository.findAll()
                .map(e -> new Category(e.getId(), e.getName()))
                .collectList();
    }

    public Mono<Void> createCategory(Category category) {
        return categoryRepository.findAll()
                .map(CategoryEntity::getId)
                .collectList()
                .flatMap(ids -> {
                    if(ids.contains(category.id())) {
                        return categoryRepository.updateName(category.id(), category. name());
                    }
                    else {
                        final var entity = new CategoryEntity();
                        entity.setId(category.id());
                        entity.setName(category.name());
                        return categoryRepository.save(entity);
                    }
                }).then();    }
}
