package com.github.blaszczyk.ramschi.ramschi_server.persistence;

import com.github.blaszczyk.ramschi.ramschi_server.domain.Category;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

import java.util.UUID;

public interface ItemRepository extends ReactiveCrudRepository<ItemEntity, UUID> {

    Flux<ItemEntity> findByNameLike(String name);

    Flux<ItemEntity> findByNameLikeAndCategory(String name, Category category);
}
