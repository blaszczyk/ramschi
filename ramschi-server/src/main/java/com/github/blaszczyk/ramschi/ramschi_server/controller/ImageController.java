package com.github.blaszczyk.ramschi.ramschi_server.controller;
import com.github.blaszczyk.ramschi.ramschi_server.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
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
    private ImageService imageService;

    @GetMapping(path = "/{id}",
            produces = { MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE })
    Mono<ResponseEntity<byte[]>> getImage(@PathVariable UUID id) {
        return imageService.getImage(id)
                .map(ImageController::ok);
    }

    @GetMapping(path = "/{id}/thumbnail",
            produces = { MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE })
    Mono<ResponseEntity<byte[]>> getThumbnail(@PathVariable UUID id) {
        return imageService.getThumbnail(id)
                .map(ImageController::ok);
    }

    @GetMapping(path = "/{id}/preview",
            produces = { MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE })
    Mono<ResponseEntity<byte[]>> getPreview(@PathVariable UUID id) {
        return imageService.getPreview(id)
                .map(ImageController::ok);
    }

    private static <T> ResponseEntity<T> ok(T t) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=31536000")
                .body(t);
    }

}
