package com.github.blaszczyk.ramschi.ramschi_server.persistence;

import com.github.blaszczyk.ramschi.ramschi_server.domain.BasicItem;
import com.github.blaszczyk.ramschi.ramschi_server.domain.Item;

import java.util.List;
import java.util.UUID;

public class ItemTransformer {

    public static ItemEntity toEntity(BasicItem item) {
        final var entity = new ItemEntity();
        entity.setId(item.id());
        entity.setName(item.name());
        entity.setDescription(item.description());
        entity.setCategory(item.category());
        entity.setPrice(item.price());
        return entity;
    }

    public static BasicItem toBasicItem(ItemEntity entity) {
        return new BasicItem(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                entity.getCategory(),
                entity.getPrice()
        );
    }

    public static Item toItem(ItemEntity entity, List<ItemAssigneeEntity> assignees, List<UUID> images) {
        return new Item(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                entity.getCategory(),
                entity.getPrice(),
                entity.getLastedit(),
                assignees.stream().map(ItemAssigneeEntity::getAssignee).toList(),
                images
        );
    }
}
