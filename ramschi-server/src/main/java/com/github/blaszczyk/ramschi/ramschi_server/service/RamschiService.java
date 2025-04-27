package com.github.blaszczyk.ramschi.ramschi_server.service;

import com.github.blaszczyk.ramschi.ramschi_server.domain.BasicItem;
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
public class RamschiService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private ItemAssigneeRepository itemAssigneeRepository;

    @Autowired
    private AssigneeRepository assigneeRepository;

    public Mono<List<BasicItem>> filterItems(
            Optional<String> filter,
            Optional<Category> category
    ) {
        final String filterTerm = filter.map(s -> "%" + s + "%").orElse("%");
        final var resultFlux = category.isPresent()
                ? itemRepository.findByNameLikeAndCategory(filterTerm, category.get())
                : itemRepository.findByNameLike(filterTerm);
        return resultFlux.map(ItemTransformer::toBasicItem)
                .collectList();
    }

    public Mono<Item> getItem(UUID id) {
        final var fetchItem = itemRepository.findById(id);
        final var fetchAssignees = itemAssigneeRepository.findByItemId(id).collectList();
        final var fetchImages = imageRepository.findByItemId(id).collectList();

        return Mono.zip(fetchItem, fetchAssignees, fetchImages)
                .map(tuple -> ItemTransformer.toItem(tuple.getT1(), tuple.getT2(), tuple.getT3()));
    }

    public Mono<UUID> saveItem(Item item) {
        final ItemEntity entity = ItemTransformer.toEntity(item);
        return itemRepository.save(entity)
                .map(ItemEntity::getId);
    }

    public Mono<byte[]> getImage(UUID id) {
        return imageRepository.findById(id)
                .map(ImageEntity::getData);
    }

    public Mono<UUID> createImage(UUID itemId, byte[] data) {
        final ImageEntity entity = new ImageEntity();
        entity.setData(data);
        entity.setItemId(itemId);
        return imageRepository.save(entity)
                .map(ImageEntity::getId);
    }

    public Mono<List<String>> getAllAssignees() {
        return assigneeRepository.findAll()
                .map(AssigneeEntity::getName)
                .collectList();
    }

    public Mono<Void> addAssignee(UUID itemId, String assignee) {
        final var entity = new ItemAssigneeEntity();
        entity.setItemId(itemId);
        entity.setAssignee(assignee);
        return itemAssigneeRepository.save(entity)
                .then();
    }
}
