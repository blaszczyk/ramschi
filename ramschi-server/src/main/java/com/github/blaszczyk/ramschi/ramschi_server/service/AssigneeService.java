package com.github.blaszczyk.ramschi.ramschi_server.service;

import com.github.blaszczyk.ramschi.ramschi_server.domain.Role;
import com.github.blaszczyk.ramschi.ramschi_server.persistence.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class AssigneeService {

    @Autowired
    private ItemAssigneeRepository itemAssigneeRepository;

    @Autowired
    private AssigneeRepository assigneeRepository;

    public Mono<List<String>> getAllAssignees() {
        return assigneeRepository.findAll()
                .map(AssigneeEntity::getName)
                .collectList();
    }

    public Mono<Void> createAssignee(String name) {
        final var entity = new AssigneeEntity();
        entity.setName(name);
        entity.setRole(Role.ASSIGNEE);
        return assigneeRepository.save(entity)
                .then();
    }

    public Mono<Void> deleteAssignee(String name) {
        return assigneeRepository.delete(name)
                .then();
    }
}
