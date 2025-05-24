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

@Service
public class ItemService {

    private static Logger LOG = LoggerFactory.getLogger(ItemService.class);

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private ItemAssigneeRepository itemAssigneeRepository;

    public Mono<List<Item>> filterItems(Optional<Boolean> includeSold) {
        final var resultFlux = includeSold.orElse(Boolean.FALSE)
                ? itemRepository.findAll()
                : itemRepository.findUnsold();
        return resultFlux
                .collectList()
                .flatMap(this::fetchSubentitiesAndTransform);
    }

    private Mono<? extends List<Item>> fetchSubentitiesAndTransform(List<ItemEntity> entities) {
        final List<UUID> ids = entities.stream().map(ItemEntity::getId).toList();
        final var fetchAssignees = itemAssigneeRepository.findByItemIds(ids)
                .collectList();
        final var fetchImages = imageRepository.findByItemIds(ids)
                .collectList();
        return Mono.zip(fetchAssignees, fetchImages)
                .map(tuple -> {
                    final var assignees = mapByItemId(tuple.getT1(), ItemAssigneeEntity::getItemId);
                    final var images = mapByItemId(tuple.getT2(), ImageEntity::getItemId);
                    return entities.stream().map(entity -> {
                        final UUID id = entity.getId();
                        return ItemTransformer.toItem(entity, assignees.get(id), images.get(id));
                    }).toList();
                });
    }

    public Mono<Item> getItem(UUID id) {
        final var fetchItem = itemRepository.findById(id);
        final var fetchAssignees = itemAssigneeRepository.findByItemId(id).collectList();
        final var fetchImages = imageRepository.findIdsByItemId(id).collectList();

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

    private static <T> Map<UUID, List<T>> mapByItemId(List<T> ts, Function<T, UUID> itemIdGetter) {
        final var result = new HashMap<UUID, List<T>>();
        ts.forEach(t -> {
            final UUID itemId = itemIdGetter.apply(t);
            if (!result.containsKey(itemId)) {
                result.put(itemId, new ArrayList<>());
            }
            result.get(itemId).add(t);
        });
        return result;
    }
}
