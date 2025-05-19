package com.github.blaszczyk.ramschi.ramschi_server.controller.util;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class InvalidReCaptchaException extends RuntimeException {
}
