package com.github.blaszczyk.ramschi.ramschi_server.persistence;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

public interface ItemAssigneeRepository extends ReactiveCrudRepository<ItemAssigneeEntity, Void> {

    Flux<ItemAssigneeEntity> findByItemId(UUID itemId);

    @Query("SELECT * FROM ramschi.item_assignee WHERE item_id IN (:itemIds)")
    Flux<ItemAssigneeEntity> findByItemIds(List<UUID> itemIds);

    Flux<ItemAssigneeEntity> findByAssignee(String assignee);

    @Query("DELETE FROM ramschi.item_assignee WHERE item_id = :itemId AND assignee = :assignee")
    Mono<Void> delete(UUID itemId, String assignee);

}
