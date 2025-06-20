package com.github.blaszczyk.ramschi.ramschi_server.service;

import com.github.blaszczyk.ramschi.ramschi_server.domain.FullItem;
import com.github.blaszczyk.ramschi.ramschi_server.domain.PlainItem;
import com.github.blaszczyk.ramschi.ramschi_server.domain.Item;
import com.github.blaszczyk.ramschi.ramschi_server.persistence.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.*;
import static com.google.common.collect.ImmutableListMultimap.toImmutableListMultimap;
import static reactor.core.publisher.Mono.zip;


@Service
public class ItemService {

    private static Logger LOG = LoggerFactory.getLogger(ItemService.class);

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private ItemAssigneeRepository itemAssigneeRepository;

    @Autowired
    private CommentRepository commentRepository;

    public Mono<List<Item>> getItems() {
        final var fetchItems = itemRepository.findAll().collectList();
        final var fetchAssignees = itemAssigneeRepository
                .findAll()
                .collect(toImmutableListMultimap(
                        ItemAssigneeEntity::getItemId,
                        ItemAssigneeEntity::getAssignee
                ));
        final var fetchImages = imageRepository
                .findAll()
                .collect(toImmutableListMultimap(
                        ImageEntity::getItemId,
                        ImageEntity::getId
                ));
        return zip(fetchItems, fetchAssignees, fetchImages).map(tuple -> {
                final var items = tuple.getT1();
                final var assignees = tuple.getT2();
                final var images = tuple.getT3();
                return items.stream().map(entity -> {
                    final UUID id = entity.getId();
                    return ItemTransformer.toItem(entity, assignees.get(id), images.get(id));
                }).toList();
        });
    }

    public Mono<FullItem> getItem(UUID id) {
        final var fetchItem = itemRepository.findById(id);
        final var fetchAssignees = itemAssigneeRepository.findByItemId(id)
                .map(ItemAssigneeEntity::getAssignee)
                .collectList();
        final var fetchImages = imageRepository.findIdsByItemId(id)
                .map(ImageEntity::getId)
                .collectList();
        final var fetchComments = commentRepository.findByItemIdOrderByLastEditAsc(id)
                .map(ItemTransformer::toComment)
                .collectList();

        return zip(fetchItem, fetchAssignees, fetchImages, fetchComments)
                .map(tuple -> ItemTransformer.toFullItem(tuple.getT1(), tuple.getT2(), tuple.getT3(), tuple.getT4()));
    }

    public Mono<List<PlainItem>> getItemsForAssignee(String assignee) {
        final var assignedItemIds = itemAssigneeRepository.findByAssignee(assignee)
                .map(ItemAssigneeEntity::getItemId);
        final var commentedItemIds = commentRepository.findByAuthor(assignee)
                .map(CommentEntity::getItemId)
                .distinct();
        return itemRepository.findAllById(assignedItemIds.concatWith(commentedItemIds))
                .map(ItemTransformer::toPlainItem)
                .collectList();
    }

    public Mono<UUID> saveItem(PlainItem item) {
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
