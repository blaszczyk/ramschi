package com.github.blaszczyk.ramschi.ramschi_server.controller;

import com.github.blaszczyk.ramschi.ramschi_server.controller.util.AuthHelper;
import com.github.blaszczyk.ramschi.ramschi_server.domain.BasicItem;
import com.github.blaszczyk.ramschi.ramschi_server.domain.Item;
import com.github.blaszczyk.ramschi.ramschi_server.domain.Role;
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

    @Autowired
    private AuthHelper authHelper;

    @GetMapping(path = "",
            produces = MediaType.APPLICATION_JSON_VALUE)
    Mono<ResponseEntity<List<Item>>> getItems(
            @RequestParam Optional<Boolean> includeSold
    ) {
        return itemService.filterItems(includeSold.orElse(Boolean.FALSE))
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
    Mono<ResponseEntity<UUID>> postItem(@RequestBody BasicItem item, @RequestHeader(RamschiHeader.AUTH) String ramschiAuth) {
        return authHelper.doIfAuthorised(ramschiAuth, Role.CONTRIBUTOR, () ->
                itemService.saveItem(item)
                        .map(ResponseEntity::ok)
        );
    }

    @DeleteMapping(path = "/{id}")
    Mono<ResponseEntity<Void>> deleteItem(
            @PathVariable UUID id,
            @RequestHeader(RamschiHeader.AUTH) String ramschiAuth) {
        return authHelper.doIfAuthorised(ramschiAuth, Role.ADMIN, () ->
                itemService.deleteItem(id)
                        .map(ResponseEntity::ok)
        );
    }

    @PutMapping(path = "/{itemId}/assignee/{assignee}")
    Mono<ResponseEntity<Void>> putItemAssignee(
           @PathVariable UUID itemId,
           @PathVariable String assignee,
           @RequestHeader(RamschiHeader.AUTH) String ramschiAuth) {
        return authHelper.doIfAuthorised(ramschiAuth, assignee, () ->
                authHelper.doIfUnsold(itemId, () ->
                        itemService.addAssignee(itemId, assignee)
                                .map(ResponseEntity::ok)
                )
        );
    }

    @DeleteMapping(path = "/{itemId}/assignee/{assignee}")
    Mono<ResponseEntity<Void>> deleteItemAssignee(
            @PathVariable UUID itemId,
            @PathVariable String assignee,
            @RequestHeader(RamschiHeader.AUTH) String ramschiAuth) {
        return authHelper.doIfAuthorised(ramschiAuth, assignee, () ->
                    authHelper.doIfUnsold(itemId, () ->
                            itemService.deleteAssignee(itemId, assignee)
                                    .map(ResponseEntity::ok)
                    )
        );
    }

    @PostMapping(path = "/{itemId}/image",
            consumes = { MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_JPEG_VALUE },
            produces = MediaType.APPLICATION_JSON_VALUE)
    Mono<ResponseEntity<UUID>> postImage(
            @PathVariable UUID itemId,
            @RequestBody byte[] data,
            @RequestHeader(RamschiHeader.AUTH) String ramschiAuth) {
        return authHelper.doIfAuthorised(ramschiAuth, Role.CONTRIBUTOR, () ->
                imageService.createImage(itemId, data)
                        .map(ResponseEntity::ok)
        );
    }

    @PostMapping(path = "/{itemId}/comment",
            consumes = { MediaType.APPLICATION_JSON_VALUE },
            produces = MediaType.APPLICATION_JSON_VALUE)
    Mono<ResponseEntity<UUID>> postComment(
            @PathVariable UUID itemId,
            @RequestBody byte[] data,
            @RequestHeader(RamschiHeader.AUTH) String ramschiAuth) {
        return authHelper.doIfAuthorised(ramschiAuth, Role.ASSIGNEE, () ->
                imageService.createImage(itemId, data)
                        .map(ResponseEntity::ok)
        );
    }
}
