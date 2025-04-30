package com.github.blaszczyk.ramschi.ramschi_server.service;

import com.github.blaszczyk.ramschi.ramschi_server.domain.Category;
import com.github.blaszczyk.ramschi.ramschi_server.domain.Item;
import com.github.blaszczyk.ramschi.ramschi_server.persistence.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ItemService {

    private static final Comparator<Item> BY_NAME = Comparator.comparing(Item::name);

    private static final Comparator<Item> BY_LAST_EDIT = Comparator.comparing(Item::lastedit).reversed();

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private ItemAssigneeRepository itemAssigneeRepository;

    public Mono<List<Item>> filterItems(
            Optional<String> filter,
            Optional<Category> category,
            Optional<String> assignee,
            boolean latestFirst
    ) {
        final String filterTerm = filter.map(s -> "%" + s + "%").orElse("%");
        return assignee.map(s -> itemAssigneeRepository.findByAssignee(s)
                .map(ItemAssigneeEntity::getItemId)
                .collectList()
                .flatMap(itemIds -> filterItems(filterTerm, category, latestFirst, itemIds)))
                .orElseGet(() -> filterItems(filterTerm, category, latestFirst, null));
    }

    private Mono<List<Item>> filterItems(String filterTerm, Optional<Category> category, boolean latestFirst, List<UUID> itemIds) {
        final Comparator<Item> comparator = latestFirst ? BY_LAST_EDIT : BY_NAME;
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
                .sort(comparator)
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
        entity.setLastedit(LocalDateTime.now());
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
