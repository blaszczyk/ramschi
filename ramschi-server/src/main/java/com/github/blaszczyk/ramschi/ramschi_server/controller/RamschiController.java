package com.github.blaszczyk.ramschi.ramschi_server.controller;

import com.github.blaszczyk.ramschi.ramschi_server.domain.BasicItem;
import com.github.blaszczyk.ramschi.ramschi_server.domain.Category;
import com.github.blaszczyk.ramschi.ramschi_server.domain.Item;
import com.github.blaszczyk.ramschi.ramschi_server.service.RamschiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@ResponseBody
public class RamschiController {

    @Autowired
    private RamschiService service;

    @GetMapping(path = "/items",
            produces = MediaType.APPLICATION_JSON_VALUE)
    Mono<ResponseEntity<List<BasicItem>>> getItems(
            @RequestParam Optional<String> filter,
            @RequestParam Optional<Category> category
    ) {
        return service.filterItems(filter, category)
                .map(ResponseEntity::ok);
    }

    @GetMapping(path = "/item/{id}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    Mono<ResponseEntity<Item>> getItem(@PathVariable UUID id) {
        return service.getItem(id)
                .map(ResponseEntity::ok);
    }

    @PostMapping(path = "/item",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    Mono<ResponseEntity<UUID>> postItem(@RequestBody Item item) {
        return service.saveItem(item)
                .map(ResponseEntity::ok);
    }

    @GetMapping(path = "/image/{id}",
            produces = { MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE })
    Mono<ResponseEntity<byte[]>> getImage(@PathVariable UUID id) {
        return service.getImage(id)
                .map(ResponseEntity::ok);
    }


    @PostMapping(path = "/item",
            consumes = { MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_JPEG_VALUE },
            produces = MediaType.TEXT_PLAIN_VALUE)
    Mono<ResponseEntity<UUID>> postImage(@PathVariable UUID itemId, @RequestBody byte[] data) {
        return service.createImage(itemId, data)
                .map(ResponseEntity::ok);
    }

    @GetMapping(path = "/assignees",
            produces = MediaType.APPLICATION_JSON_VALUE)
    Mono<ResponseEntity<List<String>>> getAssignees() {
        return service.getAllAssignees()
                .map(ResponseEntity::ok);
    }
}
