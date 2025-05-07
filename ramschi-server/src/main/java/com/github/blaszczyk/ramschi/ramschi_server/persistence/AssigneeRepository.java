package com.github.blaszczyk.ramschi.ramschi_server.persistence;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

public interface AssigneeRepository extends ReactiveCrudRepository<AssigneeEntity, String> {

    @Query("SELECT * FROM ramschi.assignee WHERE name = :name")
    Mono<AssigneeEntity> findByName(String name);

    @Query("DELETE FROM ramschi.assignee WHERE name = :name")
    Mono<Void> delete(String name);

    @Query("UPDATE ramschi.assignee SET \"password-sha256\" = :passwordSHA256, salt = :salt WHERE name = :name")
    Mono<AssigneeEntity> setPassword(String name, byte[] passwordSHA256, byte[] salt);
}
