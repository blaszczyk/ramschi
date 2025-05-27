package com.github.blaszczyk.ramschi.ramschi_server.persistence;

import com.github.blaszczyk.ramschi.ramschi_server.domain.BasicItem;
import com.github.blaszczyk.ramschi.ramschi_server.domain.Item;

import java.time.ZoneId;
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
        entity.setSold(item.sold());
        return entity;
    }

    public static Item toItem(ItemEntity entity, List<String> assignees, List<UUID> images) {
        return new Item(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                entity.getCategory(),
                entity.getPrice(),
                entity.getLastedit().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli(),
                entity.isSold(),
                assignees,
                images
        );
    }
}
