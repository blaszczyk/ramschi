package com.github.blaszczyk.ramschi.ramschi_server.controller.util;

import com.github.blaszczyk.ramschi.ramschi_server.domain.Role;
import com.github.blaszczyk.ramschi.ramschi_server.service.AuthService;
import com.github.blaszczyk.ramschi.ramschi_server.service.ItemService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.UUID;
import java.util.function.Supplier;

@Component
public class AuthHelper {

    @Autowired
    private AuthService authService;

    @Autowired
    private ItemService itemService;

    public <T> Mono<T> doIfAuthorised(String ramschiAuth, Role requiredRole, Supplier<Mono<T>> action) {
        return authService.getAuthInfo(ramschiAuth)
                .flatMap(authInfo -> {
                    if (authInfo.hasRole(requiredRole)) {
                        return action.get();
                    } else {
                        throw new UnauthorizedException();
                    }
                });
    }

    public <T> Mono<T> doIfAuthorised(String ramschiAuth, String assignee, Supplier<Mono<T>> action) {
        return authService.getAuthInfo(ramschiAuth)
                .flatMap(authInfo -> {
                    if (StringUtils.equals(assignee, authInfo.name()) || authInfo.hasRole(Role.ADMIN)) {
                        return action.get();
                    } else {
                        throw new UnauthorizedException();
                    }
                });
    }

    public <T> Mono<T> doIfUnsold(UUID itemId, Supplier<Mono<T>> action) {
        if (itemId == null) {
            return action.get();
        }
        return itemService.getItem(itemId)
                .flatMap(itemEntity -> {
                    if (!itemEntity.sold()) {
                        return action.get();
                    } else {
                        throw new UnauthorizedException();
                    }
                });
    }

}
