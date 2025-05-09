package com.github.blaszczyk.ramschi.ramschi_server.persistence;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

import java.util.UUID;

public interface CommentRepository extends ReactiveCrudRepository<CommentEntity, UUID> {

//    @Query("SELECT * FROM ramschi.comment WHERE item_id = :itemId ORDER BY lastedit DESC")
    Flux<CommentEntity> findByItemIdOrderByLastEditDesc(UUID itemId);

}
