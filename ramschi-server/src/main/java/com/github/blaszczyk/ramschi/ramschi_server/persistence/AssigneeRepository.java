package com.github.blaszczyk.ramschi.ramschi_server.persistence;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface AssigneeRepository extends ReactiveCrudRepository<AssigneeEntity, String> {

    @Query("DELETE FROM ramschi.assignee WHERE name = :name")
    Mono<Void> delete(String name);
}
