package com.github.blaszczyk.ramschi.ramschi_server.controller;

import com.github.blaszczyk.ramschi.ramschi_server.controller.util.AuthHelper;
import com.github.blaszczyk.ramschi.ramschi_server.domain.FullItem;
import com.github.blaszczyk.ramschi.ramschi_server.domain.PlainItem;
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
    Mono<ResponseEntity<List<Item>>> getItems() {
        return itemService.getItems()
                .map(ResponseEntity::ok);
    }

    @GetMapping(path = "/{id}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    Mono<ResponseEntity<FullItem>> getItem(@PathVariable UUID id) {
        return itemService.getItem(id)
                .map(ResponseEntity::ok);
    }

    @GetMapping(path = "/assignee/{assignee}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    Mono<ResponseEntity<List<PlainItem>>> getItemsForAssignee(@PathVariable String assignee) {
        return itemService.getItemsForAssignee(assignee)
                .map(ResponseEntity::ok);
    }

    @PostMapping(path = "",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    Mono<ResponseEntity<UUID>> postItem(@RequestBody PlainItem item, @RequestHeader(RamschiHeader.AUTH) String ramschiAuth) {
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
}
