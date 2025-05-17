package com.github.blaszczyk.ramschi.ramschi_server.persistence;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

import java.util.UUID;

public interface CommentRepository extends ReactiveCrudRepository<CommentEntity, UUID> {

    Flux<CommentEntity> findByItemIdOrderByLastEditAsc(UUID itemId);

}
