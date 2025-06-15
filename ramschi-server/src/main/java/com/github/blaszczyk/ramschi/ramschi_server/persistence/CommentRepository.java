package com.github.blaszczyk.ramschi.ramschi_server.persistence;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface CommentRepository extends ReactiveCrudRepository<CommentEntity, UUID> {

    Flux<CommentEntity> findByItemIdOrderByLastEditAsc(UUID itemId);

    @Query("SELECT author FROM ramschi.comment WHERE id = :id")
    Mono<String>findAuthorById(UUID id);

    Flux<CommentEntity> findByAuthor(String author);

}
