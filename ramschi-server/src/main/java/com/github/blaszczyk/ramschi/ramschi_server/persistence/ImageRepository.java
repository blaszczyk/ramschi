package com.github.blaszczyk.ramschi.ramschi_server.persistence;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

import java.util.UUID;

public interface ImageRepository  extends ReactiveCrudRepository<ImageEntity, UUID> {

    Flux<ImageEntity> findByItemId(UUID itemId);

}
