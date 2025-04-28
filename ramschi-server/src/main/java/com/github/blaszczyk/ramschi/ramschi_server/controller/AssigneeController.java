package com.github.blaszczyk.ramschi.ramschi_server.controller;

import com.github.blaszczyk.ramschi.ramschi_server.service.AssigneeService;
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

    @GetMapping(path = "",
            produces = MediaType.APPLICATION_JSON_VALUE)
    Mono<ResponseEntity<List<String>>> getAssignees() {
        return assigneeService.getAllAssignees()
                .map(ResponseEntity::ok);
    }

    @PostMapping(path = "/{name}")
    Mono<ResponseEntity<Void>> postAssignee(@PathVariable String name) {
        return assigneeService.createAssignee(name)
                .map(ResponseEntity::ok);
    }

    @DeleteMapping(path = "/{name}")
    Mono<ResponseEntity<Void>> deleteAssignee(@PathVariable String name) {
        return assigneeService.deleteAssignee(name)
                .map(ResponseEntity::ok);
    }
}
