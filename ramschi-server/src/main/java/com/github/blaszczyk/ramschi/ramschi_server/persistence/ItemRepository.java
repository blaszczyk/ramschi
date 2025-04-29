package com.github.blaszczyk.ramschi.ramschi_server.persistence;

import com.github.blaszczyk.ramschi.ramschi_server.domain.Category;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

import java.util.UUID;

public interface ItemRepository extends ReactiveCrudRepository<ItemEntity, UUID> {

    @Query("SELECT * FROM ramschi.item WHERE UPPER(name) LIKE UPPER(:name)")
    Flux<ItemEntity> findByNameLike(String name);

    @Query("SELECT * FROM ramschi.item WHERE UPPER(name) LIKE UPPER(:name) AND category = :category")
    Flux<ItemEntity> findByNameLikeAndCategory(String name, Category category);
}
