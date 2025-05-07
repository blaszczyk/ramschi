package com.github.blaszczyk.ramschi.ramschi_server.controller;

import org.springframework.http.ResponseEntity;
import reactor.core.publisher.Mono;

public class HttpResponseHelper {
    public static <T> Mono<ResponseEntity<T>> unauthorized() {
        return Mono.just(ResponseEntity.status(401).build());
    }
}
