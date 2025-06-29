package com.github.blaszczyk.ramschi.ramschi_server.persistence;

import com.github.blaszczyk.ramschi.ramschi_server.domain.Comment;
import com.github.blaszczyk.ramschi.ramschi_server.domain.FullItem;
import com.github.blaszczyk.ramschi.ramschi_server.domain.PlainItem;
import com.github.blaszczyk.ramschi.ramschi_server.domain.Item;

import java.time.ZoneId;
import java.util.List;
import java.util.UUID;

public class ItemTransformer {

    public static ItemEntity toEntity(PlainItem item) {
        final var entity = new ItemEntity();
        entity.setId(item.id());
        entity.setName(item.name());
        entity.setDescription(item.description());
        entity.setCategory(item.category());
        entity.setSold(item.sold());
        return entity;
    }

    public static PlainItem toPlainItem(ItemEntity entity) {
        return new PlainItem(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                entity.getCategory(),
                entity.isSold()
        );
    }

    public static Item toItem(ItemEntity entity, List<String> assignees, List<UUID> images) {
        return new Item(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                entity.getCategory(),
                entity.getLastedit().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli(),
                entity.isSold(),
                assignees,
                images
        );
    }

    public static FullItem toFullItem(ItemEntity entity,
                                      List<String> assignees,
                                      List<UUID> images,
                                      List<Comment> comments) {
        return new FullItem(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                entity.getCategory(),
                entity.isSold(),
                assignees,
                images,
                comments
        );
    }

    public static Comment toComment(CommentEntity entity) {
        return new Comment(entity.getId(), entity.getItemId(), entity.getAuthor(), entity.getText(), entity.getLastEdit());
    }
}
