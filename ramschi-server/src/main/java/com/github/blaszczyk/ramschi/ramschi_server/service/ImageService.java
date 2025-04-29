package com.github.blaszczyk.ramschi.ramschi_server.service;

import com.github.blaszczyk.ramschi.ramschi_server.domain.Item;
import com.github.blaszczyk.ramschi.ramschi_server.persistence.*;
import com.github.blaszczyk.ramschi.ramschi_server.util.ImageScaler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Service
public class ImageService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private ImageScaler imageScaler;

    public Mono<UUID> saveItem(Item item) {
        final ItemEntity entity = ItemTransformer.toEntity(item);
        return itemRepository.save(entity)
                .map(ItemEntity::getId);
    }

    public Mono<UUID> createImage(UUID itemId, byte[] data) {
        final ImageEntity entity = new ImageEntity();
        entity.setOriginal(data);
        entity.setItemId(itemId);
        imageScaler.addThumbnailAndPreview(entity);
        return imageRepository.save(entity)
                .map(ImageEntity::getId);
    }

    public Mono<byte[]> getImage(UUID id) {
        return imageRepository.getOriginal(id)
                .map(ImageEntity::getOriginal);
    }

    public Mono<byte[]> getThumbnail(UUID id) {
        return imageRepository.getThumbnail(id)
                .map(ImageEntity::getThumbnail);
    }

    public Mono<byte[]> getPreview(UUID id) {
        return imageRepository.getPreview(id)
                .map(ImageEntity::getPreview);
    }

    public Mono<Void> deleteImage(UUID id) {
        return imageRepository.deleteById(id);
    }
}
