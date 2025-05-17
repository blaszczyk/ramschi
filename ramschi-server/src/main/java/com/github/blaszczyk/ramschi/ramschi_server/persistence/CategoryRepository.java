package com.github.blaszczyk.ramschi.ramschi_server.persistence;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

public interface CategoryRepository extends ReactiveCrudRepository<CategoryEntity, String> {

    @Query("UPDATE ramschi.category SET name = :name WHERE id = :id")
    Mono<Void> updateName(String id, String name);

}
