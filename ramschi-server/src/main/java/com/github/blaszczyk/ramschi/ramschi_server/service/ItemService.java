package com.github.blaszczyk.ramschi.ramschi_server.service;

import com.github.blaszczyk.ramschi.ramschi_server.domain.BasicItem;
import com.github.blaszczyk.ramschi.ramschi_server.domain.Item;
import com.github.blaszczyk.ramschi.ramschi_server.persistence.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import static com.google.common.collect.ImmutableListMultimap.toImmutableListMultimap;

@Service
public class ItemService {

    private static Logger LOG = LoggerFactory.getLogger(ItemService.class);

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private ItemAssigneeRepository itemAssigneeRepository;

    public Mono<List<Item>> filterItems(boolean includeSold) {
        final var entityFlux = includeSold
                ? itemRepository.findAll()
                : itemRepository.findUnsold();
        return entityFlux
                .collectList()
                .flatMap(entities -> {
                    final List<UUID> ids = entities.stream().map(ItemEntity::getId).toList();
                    final var fetchAssignees = itemAssigneeRepository.findByItemIds(ids)
                        .collect(toImmutableListMultimap(ItemAssigneeEntity::getItemId, ItemAssigneeEntity::getAssignee));
                    final var fetchImages = imageRepository.findByItemIds(ids)
                        .collect(toImmutableListMultimap(ImageEntity::getItemId, ImageEntity::getId));
                    return Mono.zip(fetchAssignees, fetchImages).map(tuple -> {
                        final var assignees = tuple.getT1();
                        final var images = tuple.getT2();
                        return entities.stream().map(entity -> {
                            final UUID id = entity.getId();
                            return ItemTransformer.toItem(entity, assignees.get(id), images.get(id));
                        }).toList();
                    });
                });
    }

    public Mono<Item> getItem(UUID id) {
        final var fetchItem = itemRepository.findById(id);
        final var fetchAssignees = itemAssigneeRepository.findByItemId(id)
                .map(ItemAssigneeEntity::getAssignee)
                .collectList();
        final var fetchImages = imageRepository.findIdsByItemId(id)
                .map(ImageEntity::getId)
                .collectList();

        return Mono.zip(fetchItem, fetchAssignees, fetchImages)
                .map(tuple -> ItemTransformer.toItem(tuple.getT1(), tuple.getT2(), tuple.getT3()));
    }

    public Mono<UUID> saveItem(BasicItem item) {
        LOG.info("Saving Item: {}", item);
        final ItemEntity entity = ItemTransformer.toEntity(item);
        entity.setLastedit(LocalDateTime.now());
        return itemRepository.save(entity)
                .map(ItemEntity::getId);
    }

    public Mono<Void> addAssignee(UUID itemId, String assignee) {
        LOG.info("Assigning {} to {}", assignee, itemId);
        final var entity = new ItemAssigneeEntity();
        entity.setItemId(itemId);
        entity.setAssignee(assignee);
        return itemAssigneeRepository.save(entity)
                .then();
    }

    public Mono<Void> deleteAssignee(UUID itemId, String assignee) {
        LOG.info("Unassigning {} from {}", assignee, itemId);
        return itemAssigneeRepository.delete(itemId, assignee)
                .then();
    }

    public Mono<Void> deleteItem(UUID id) {
        LOG.info("Deleting {}", id);
        return itemRepository.deleteById(id);
    }

}
