package com.github.blaszczyk.ramschi.ramschi_server.persistence;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

import java.util.UUID;

public interface ItemAssigneeRepository extends ReactiveCrudRepository<ItemAssigneeEntity, Void> {

    Flux<ItemAssigneeEntity> findByItemId(UUID itemId);
}
