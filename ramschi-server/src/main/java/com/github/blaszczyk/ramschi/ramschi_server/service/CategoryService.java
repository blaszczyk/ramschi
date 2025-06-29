package com.github.blaszczyk.ramschi.ramschi_server.service;

import com.github.blaszczyk.ramschi.ramschi_server.domain.Category;
import com.github.blaszczyk.ramschi.ramschi_server.persistence.*;
import org.apache.commons.codec.binary.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Comparator;
import java.util.List;

@Service
public class CategoryService {

    private final static String LAST_CATEGORY = "OTHER";

    private static final Comparator<? super CategoryEntity> BY_NAME_OTHER_LAST = (c1, c2)-> {
        if (StringUtils.equals(c1.getId(), LAST_CATEGORY)) {
            return 1;
        }
        if (StringUtils.equals(c2.getId(), LAST_CATEGORY)) {
            return -1;
        }
        return c1.getName().compareTo(c2.getName());
    };

    @Autowired
    private CategoryRepository categoryRepository;

    public Mono<List<Category>> getAllCategories() {
        return categoryRepository.findAll()
                .sort(BY_NAME_OTHER_LAST)
                .map(entity -> new Category(entity.getId(), entity.getName()))
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
