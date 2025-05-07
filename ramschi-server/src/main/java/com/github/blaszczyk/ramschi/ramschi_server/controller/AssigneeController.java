package com.github.blaszczyk.ramschi.ramschi_server.controller;

import com.github.blaszczyk.ramschi.ramschi_server.domain.LoginResponse;
import com.github.blaszczyk.ramschi.ramschi_server.service.AssigneeService;
import com.github.blaszczyk.ramschi.ramschi_server.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

import static com.github.blaszczyk.ramschi.ramschi_server.controller.HttpResponseHelper.unauthorized;

@RestController
@RequestMapping("/api/assignee")
@ResponseBody
public class AssigneeController {

    @Autowired
    private AssigneeService assigneeService;

    @Autowired
    private AuthService authService;

    @GetMapping(path = "",
            produces = MediaType.APPLICATION_JSON_VALUE)
    Mono<ResponseEntity<List<String>>> getAssignees() {
        return assigneeService.getAllAssignees()
                .map(ResponseEntity::ok);
    }

    @PostMapping(path = "/login")
    Mono<ResponseEntity<LoginResponse>> login(
            @RequestHeader(RamschiHeader.AUTH) String ramschiAuth) {
        return authService.login(ramschiAuth)
                .map(ResponseEntity::ok)
                .switchIfEmpty(unauthorized());
    }

    @PostMapping(path = "/{name}")
    Mono<ResponseEntity<Void>> postAssignee(
            @PathVariable String name,
            @RequestHeader(RamschiHeader.AUTH) String ramschiAuth) {
        return authService.getAuthInfo(ramschiAuth)
                .flatMap(authInfo -> {
                    if (authInfo.isAdmin()) {
                        return assigneeService.createAssignee(name)
                                .map(ResponseEntity::ok);
                    } else {
                        return unauthorized();
                    }
                });
    }

    @DeleteMapping(path = "/{name}")
    Mono<ResponseEntity<Void>> deleteAssignee(
            @PathVariable String name,
            @RequestHeader(RamschiHeader.AUTH) String ramschiAuth) {
        return authService.getAuthInfo(ramschiAuth)
                .flatMap(authInfo -> {
                    if (authInfo.isAdmin()) {
                        return assigneeService.deleteAssignee(name)
                                .map(ResponseEntity::ok);
                    } else {
                        return unauthorized();
                    }
                });
    }

    @DeleteMapping(path = "/{name}/password")
    Mono<ResponseEntity<Void>> resetPassword(
            @PathVariable String name,
            @RequestHeader(RamschiHeader.AUTH) String ramschiAuth) {
        return authService.getAuthInfo(ramschiAuth)
                .flatMap(authInfo -> {
                    if (authInfo.isAdmin()) {
                        return assigneeService.resetPassword(name)
                                .map(ResponseEntity::ok);
                    } else {
                        return unauthorized();
                    }
                });
    }
}
