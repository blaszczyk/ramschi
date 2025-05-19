package com.github.blaszczyk.ramschi.ramschi_server.controller.util;

import com.github.blaszczyk.ramschi.ramschi_server.service.RecaptchaV3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.function.Supplier;

@Component
public class RecaptchaV3Helper {

    @Autowired
    private RecaptchaV3Service recaptchaV3Service;

    public <T> Mono<T> doIfHuman(String token, String actionName, Supplier<Mono<T>> action) {
        return recaptchaV3Service.verify(token, actionName)
                .flatMap(isHuman -> {
                    if (isHuman) {
                        return action.get();
                    } else {
                        throw new InvalidReCaptchaException();
                    }
                });
    }
}
