package com.github.blaszczyk.ramschi.ramschi_server.service;

import com.github.blaszczyk.ramschi.ramschi_server.domain.Category;
import com.github.blaszczyk.ramschi.ramschi_server.domain.Item;
import com.github.blaszczyk.ramschi.ramschi_server.persistence.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private ItemAssigneeRepository itemAssigneeRepository;

    public Mono<List<Item>> filterItems(
            Optional<String> filter,
            Optional<Category> category,
            Optional<String> assignee
    ) {
        final String filterTerm = filter.map(s -> "%" + s + "%").orElse("%");
        if (assignee.isPresent()) {
            return itemAssigneeRepository.findByAssignee(assignee.get())
                    .map(ItemAssigneeEntity::getItemId)
                    .collectList()
                    .flatMap(itemIds -> filterItems(filterTerm, category, itemIds));
        }
        else {
            return filterItems(filterTerm, category, null);
        }
    }

    private Mono<List<Item>> filterItems(String filterTerm, Optional<Category> category, List<UUID> itemIds) {
        final var resultFlux = category.isPresent()
                ? itemRepository.findByNameLikeAndCategory(filterTerm, category.get())
                : itemRepository.findByNameLike(filterTerm);
        return resultFlux
                .filter(entity -> itemIds == null || itemIds.contains(entity.getId()))
                .flatMap(entity -> {
                    final UUID id = entity.getId();
                    var fetchAssignees = itemAssigneeRepository.findByItemId(id)
                            .collectList();
                    var fetchImages = imageRepository.findIdsByItemId(id)
                            .collectList();
                    return Mono.zip(fetchAssignees, fetchImages)
                            .map(tuple -> ItemTransformer.toItem(entity, tuple.getT1(), tuple.getT2()));
                })
                .collectList();
    }

    public Mono<Item> getItem(UUID id) {
        final var fetchItem = itemRepository.findById(id);
        final var fetchAssignees = itemAssigneeRepository.findByItemId(id).collectList();
        final var fetchImages = imageRepository.findIdsByItemId(id).collectList();

        return Mono.zip(fetchItem, fetchAssignees, fetchImages)
                .map(tuple -> ItemTransformer.toItem(tuple.getT1(), tuple.getT2(), tuple.getT3()));
    }

    public Mono<UUID> saveItem(Item item) {
        final ItemEntity entity = ItemTransformer.toEntity(item);
        return itemRepository.save(entity)
                .map(ItemEntity::getId);
    }

    public Mono<Void> addAssignee(UUID itemId, String assignee) {
        final var entity = new ItemAssigneeEntity();
        entity.setItemId(itemId);
        entity.setAssignee(assignee);
        return itemAssigneeRepository.save(entity)
                .then();
    }

    public Mono<Void> deleteAssignee(UUID itemId, String assignee) {
        return itemAssigneeRepository.delete(itemId, assignee)
                .then();
    }

    public Mono<Void> deleteItem(UUID id) {
        return itemRepository.deleteById(id);
    }
}
