package com.github.blaszczyk.ramschi.ramschi_server.controller;

import com.github.blaszczyk.ramschi.ramschi_server.domain.BasicItem;
import com.github.blaszczyk.ramschi.ramschi_server.domain.Category;
import com.github.blaszczyk.ramschi.ramschi_server.domain.Item;
import com.github.blaszczyk.ramschi.ramschi_server.service.ImageService;
import com.github.blaszczyk.ramschi.ramschi_server.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/item")
@ResponseBody
public class ItemController {

    @Autowired
    private ItemService itemService;

    @Autowired
    private ImageService imageService;

    @GetMapping(path = "",
            produces = MediaType.APPLICATION_JSON_VALUE)
    Mono<ResponseEntity<List<Item>>> getItems(
            @RequestParam Optional<String> filter,
            @RequestParam Optional<Category> category,
            @RequestParam Optional<String> assignee
    ) {
        return itemService.filterItems(filter, category, assignee)
                .map(ResponseEntity::ok);
    }

    @GetMapping(path = "/{id}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    Mono<ResponseEntity<Item>> getItem(@PathVariable UUID id) {
        return itemService.getItem(id)
                .map(ResponseEntity::ok);
    }

    @PostMapping(path = "",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    Mono<ResponseEntity<UUID>> postItem(@RequestBody Item item) {
        return itemService.saveItem(item)
                .map(ResponseEntity::ok);
    }

    @DeleteMapping(path = "/{id}")
    Mono<ResponseEntity<Void>> deleteItem(@PathVariable UUID id) {
        return itemService.deleteItem(id)
                .map(ResponseEntity::ok);
    }

    @PutMapping(path = "/{itemId}/assignee/{assignee}")
    Mono<ResponseEntity<Void>> putItemAssignee(@PathVariable UUID itemId, @PathVariable String assignee) {
        return itemService.addAssignee(itemId, assignee)
                .map(ResponseEntity::ok);
    }

    @DeleteMapping(path = "/{itemId}/assignee/{assignee}")
    Mono<ResponseEntity<Void>> deleteItemAssignee(@PathVariable UUID itemId, @PathVariable String assignee) {
        return itemService.deleteAssignee(itemId, assignee)
                .map(ResponseEntity::ok);
    }

    @PostMapping(path = "/{itemId}/image",
            consumes = { MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_JPEG_VALUE },
            produces = MediaType.APPLICATION_JSON_VALUE)
    Mono<ResponseEntity<UUID>> postImage(@PathVariable UUID itemId, @RequestBody byte[] data) {
        return imageService.createImage(itemId, data)
                .map(ResponseEntity::ok);
    }
}
