package com.github.blaszczyk.ramschi.ramschi_server.controller;

import com.github.blaszczyk.ramschi.ramschi_server.domain.Role;
import com.github.blaszczyk.ramschi.ramschi_server.service.AuthService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.function.Supplier;

@Component
public class AuthHelper {

    @Autowired
    private AuthService authService;

    public <T> Mono<ResponseEntity<T>> doIfAuthorised(String ramschiAuth, Role requiredRole, Supplier<Mono<T>> action) {
        return authService.getAuthInfo(ramschiAuth)
                .flatMap(authInfo -> {
                    if (authInfo.hasRole(requiredRole)) {
                        return action.get()
                                .map(ResponseEntity::ok);
                    } else {
                        return Mono.just(ResponseEntity.status(401).build());
                    }
                });
    }

    public <T> Mono<ResponseEntity<T>> doIfAuthorised(String ramschiAuth, String assignee, Supplier<Mono<T>> action) {
        return authService.getAuthInfo(ramschiAuth)
                .flatMap(authInfo -> {
                    if (StringUtils.equals(assignee, authInfo.name()) || authInfo.hasRole(Role.ADMIN)) {
                        return action.get()
                                .map(ResponseEntity::ok);
                    } else {
                        return Mono.just(ResponseEntity.status(401).build());
                    }
                });
    }

}
