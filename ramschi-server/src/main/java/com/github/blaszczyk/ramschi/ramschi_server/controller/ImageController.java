package com.github.blaszczyk.ramschi.ramschi_server.controller;

import com.github.blaszczyk.ramschi.ramschi_server.controller.util.AuthHelper;
import com.github.blaszczyk.ramschi.ramschi_server.domain.Role;
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

    @Autowired
    private AuthHelper authHelper;

    @GetMapping(path = "/{id}",
            produces = { MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE })
    Mono<ResponseEntity<byte[]>> getOriginal(@PathVariable UUID id) {
        return imageService.getOriginal(id)
                .map(ImageController::okWithCacheControl);
    }

    @GetMapping(path = "/{id}/thumbnail",
            produces = { MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE })
    Mono<ResponseEntity<byte[]>> getThumbnail(@PathVariable UUID id) {
        return imageService.getThumbnail(id)
                .map(ImageController::okWithCacheControl);
    }

    @GetMapping(path = "/{id}/preview",
            produces = { MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE })
    Mono<ResponseEntity<byte[]>> getPreview(@PathVariable UUID id) {
        return imageService.getPreview(id)
                .map(ImageController::okWithCacheControl);
    }

    @DeleteMapping(path = "/{id}")
    Mono<ResponseEntity<Void>> deleteImage(@PathVariable UUID id,
                                           @RequestHeader(RamschiHeader.AUTH) String ramschiAuth) {
        return authHelper.doIfAuthorised(ramschiAuth, Role.ADMIN, () ->
                imageService.deleteImage(id)
                        .map(ResponseEntity::ok)
        );
    }

    private static <T> ResponseEntity<T> okWithCacheControl(T t) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=31536000")
                .body(t);
    }

}
