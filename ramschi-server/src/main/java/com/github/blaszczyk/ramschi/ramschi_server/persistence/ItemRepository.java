package com.github.blaszczyk.ramschi.ramschi_server.persistence;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import java.util.UUID;

public interface ItemRepository extends ReactiveCrudRepository<ItemEntity, UUID> {
}
