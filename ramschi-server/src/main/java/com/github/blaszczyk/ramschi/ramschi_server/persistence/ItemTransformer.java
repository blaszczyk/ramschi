package com.github.blaszczyk.ramschi.ramschi_server.persistence;

import com.github.blaszczyk.ramschi.ramschi_server.domain.BasicItem;
import com.github.blaszczyk.ramschi.ramschi_server.domain.Item;

import java.util.List;

public class ItemTransformer {

    public static ItemEntity toEntity(Item item) {
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

    public static Item toItem(ItemEntity entity, List<ItemAssigneeEntity> assignees, List<ImageEntity> images) {
        return new Item(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                entity.getCategory(),
                entity.getPrice(),
                assignees.stream().map(ItemAssigneeEntity::getAssignee).toList(),
                images.stream().map(ImageEntity::getId).toList()
        );
    }
}
