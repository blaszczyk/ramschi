package com.github.blaszczyk.ramschi.ramschi_server.controller;
import com.github.blaszczyk.ramschi.ramschi_server.service.AssigneeService;
import com.github.blaszczyk.ramschi.ramschi_server.service.ImageService;
import com.github.blaszczyk.ramschi.ramschi_server.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/api/image")
@ResponseBody
public class ImageController {

    @Autowired
    private ItemService itemService;

    @Autowired
    private ImageService imageService;

    @Autowired
    private AssigneeService assigneeService;

    @GetMapping(path = "/{id}",
            produces = { MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE })
    Mono<ResponseEntity<byte[]>> getImage(@PathVariable UUID id) {
        return imageService.getImage(id)
                .map(ResponseEntity::ok);
    }

    @GetMapping(path = "/{id}/thumbnail",
            produces = { MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE })
    Mono<ResponseEntity<byte[]>> getThumbnail(@PathVariable UUID id) {
        return imageService.getThumbnail(id)
                .map(ResponseEntity::ok);
    }

    @GetMapping(path = "/{id}/preview",
            produces = { MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE })
    Mono<ResponseEntity<byte[]>> getPreview(@PathVariable UUID id) {
        return imageService.getPreview(id)
                .map(ResponseEntity::ok);
    }

}
