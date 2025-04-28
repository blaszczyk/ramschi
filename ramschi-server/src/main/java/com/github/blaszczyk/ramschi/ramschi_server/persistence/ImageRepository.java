package com.github.blaszczyk.ramschi.ramschi_server.persistence;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface ImageRepository  extends ReactiveCrudRepository<ImageEntity, UUID> {

    @Query("SELECT id FROM ramschi.image WHERE item_id = :itemId")
    Flux<UUID> findIdsByItemId(UUID itemId);

    @Query("SELECT original FROM ramschi.image WHERE id = :id")
    Mono<ImageEntity> getOriginal(UUID id);

    @Query("SELECT thumbnail FROM ramschi.image WHERE id = :id")
    Mono<ImageEntity> getThumbnail(UUID id);

    @Query("SELECT preview FROM ramschi.image WHERE id = :id")
    Mono<ImageEntity> getPreview(UUID id);
}
