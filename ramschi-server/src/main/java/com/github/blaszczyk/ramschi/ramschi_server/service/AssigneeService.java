package com.github.blaszczyk.ramschi.ramschi_server.service;

import com.github.blaszczyk.ramschi.ramschi_server.domain.Assignee;
import com.github.blaszczyk.ramschi.ramschi_server.domain.Role;
import com.github.blaszczyk.ramschi.ramschi_server.persistence.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class AssigneeService {

    private static final byte[] EMPTY_BYTE_ARRAY = new byte[0];

    @Autowired
    private ItemAssigneeRepository itemAssigneeRepository;

    @Autowired
    private AssigneeRepository assigneeRepository;

    public Mono<List<String>> getAllAssigneeNames() {
        return assigneeRepository.findNames()
                .map(AssigneeEntity::getName)
                .collectList();
    }

    public Mono<List<Assignee>> getAllAssignees() {
        return assigneeRepository.findAllOrderByName()
                .map(entity -> new Assignee(entity.getName(), entity.getRole()))
                .collectList();
    }

    public Mono<Void> deleteAssignee(String name) {
        return assigneeRepository.delete(name)
                .then();
    }

    public Mono<Void> resetPassword(String name) {
        return assigneeRepository.setPassword(name, EMPTY_BYTE_ARRAY, EMPTY_BYTE_ARRAY)
                .then();
    }

    public Mono<Void> setRole(String name, Role role) {
        return assigneeRepository.setRole(name, role)
                .then();
    }
}
