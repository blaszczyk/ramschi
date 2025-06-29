package com.github.blaszczyk.ramschi.ramschi_server.controller;

import com.github.blaszczyk.ramschi.ramschi_server.controller.util.AuthHelper;
import com.github.blaszczyk.ramschi.ramschi_server.controller.util.RecaptchaV3Helper;
import com.github.blaszczyk.ramschi.ramschi_server.domain.Assignee;
import com.github.blaszczyk.ramschi.ramschi_server.domain.LoginResponse;
import com.github.blaszczyk.ramschi.ramschi_server.domain.Role;
import com.github.blaszczyk.ramschi.ramschi_server.service.AssigneeService;
import com.github.blaszczyk.ramschi.ramschi_server.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;


@RestController
@RequestMapping("/api/assignee")
@ResponseBody
public class AssigneeController {

    @Autowired
    private AssigneeService assigneeService;

    @Autowired
    private AuthService authService;

    @Autowired
    private AuthHelper authHelper;

    @Autowired
    private RecaptchaV3Helper recaptchaV3Helper;

    @GetMapping(path = "",
            produces = MediaType.APPLICATION_JSON_VALUE)
    Mono<ResponseEntity<List<String>>> getAssignees() {
        return assigneeService.getAllAssigneeNames()
                .map(ResponseEntity::ok);
    }

    @GetMapping(path = "/full",
            produces = MediaType.APPLICATION_JSON_VALUE)
    Mono<ResponseEntity<List<Assignee>>> getFullAssignees(
            @RequestHeader(RamschiHeader.AUTH) String ramschiAuth) {
        return authHelper.doIfAuthorised(ramschiAuth, Role.ADMIN, () ->
                assigneeService.getAllAssignees()
                        .map(ResponseEntity::ok)
        );
    }

    @PostMapping(path = "/login")
    Mono<ResponseEntity<LoginResponse>> login(
            @RequestHeader(RamschiHeader.RECAPTCHA) String token,
            @RequestHeader(RamschiHeader.AUTH) String ramschiAuth) {
        return recaptchaV3Helper.doIfHuman(token, "login", () ->
                authService.login(ramschiAuth))
                .map(ResponseEntity::ok);
    }

    @DeleteMapping(path = "/{name}")
    Mono<ResponseEntity<Void>> deleteAssignee(
            @PathVariable String name,
            @RequestHeader(RamschiHeader.AUTH) String ramschiAuth) {
        return authHelper.doIfAuthorised(ramschiAuth, Role.ADMIN, () ->
                assigneeService.deleteAssignee(name)
                        .map(ResponseEntity::ok)
        );
    }

    @DeleteMapping(path = "/{name}/password")
    Mono<ResponseEntity<Void>> resetPassword(
            @PathVariable String name,
            @RequestHeader(RamschiHeader.AUTH) String ramschiAuth) {
        return authHelper.doIfAuthorised(ramschiAuth, Role.ADMIN, () ->
                assigneeService.resetPassword(name)
                        .map(ResponseEntity::ok)
        );
    }

    @PutMapping(path = "/{name}/role/{role}")
    Mono<ResponseEntity<Void>> setRole(
            @PathVariable String name,
            @PathVariable Role role,
            @RequestHeader(RamschiHeader.AUTH) String ramschiAuth) {
        return authHelper.doIfAuthorised(ramschiAuth, Role.ADMIN, () ->
                assigneeService.setRole(name, role)
                        .map(ResponseEntity::ok)
        );
    }
}
