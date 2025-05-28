package com.github.blaszczyk.ramschi.ramschi_server.service;

import com.github.blaszczyk.ramschi.ramschi_server.domain.Assignee;
import com.github.blaszczyk.ramschi.ramschi_server.domain.Role;
import com.github.blaszczyk.ramschi.ramschi_server.persistence.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;

import static com.google.common.collect.ImmutableSet.toImmutableSet;
import static reactor.core.publisher.Mono.zip;

@Service
public class AssigneeService {

    private static final byte[] EMPTY_BYTE_ARRAY = new byte[0];

    @Autowired
    private AssigneeRepository assigneeRepository;

    @Autowired
    private ItemAssigneeRepository itemAssigneeRepository;

    @Autowired
    private CommentRepository commentRepository;


    public Mono<List<String>> getAllAssigneeNames() {
        return assigneeRepository.findNames()
                .map(AssigneeEntity::getName)
                .collectList();
    }

    public Mono<List<Assignee>> getAllAssignees() {
        final var fetchAssignees = assigneeRepository.findAllOrderByName().collectList();
        final var fetchItems = itemAssigneeRepository.findAll()
                .map(ItemAssigneeEntity::getAssignee)
                .collect(toImmutableSet());
        final var fetchComments = commentRepository.findAll()
                .map(CommentEntity::getAuthor)
                .collect(toImmutableSet());
        return zip(fetchAssignees, fetchItems, fetchComments).map(tuple -> {
                    final var entities = tuple.getT1();
                    final var items = tuple.getT2();
                    final var comments = tuple.getT3();
                    return entities.stream().map(entity -> {
                        final byte[] passwordSHA256 = entity.getPasswordSHA256();;
                        final boolean secure = passwordSHA256 != null && passwordSHA256.length > 0;
                        final boolean active = items.contains(entity.getName()) || comments.contains(entity.getName());
                        return new Assignee(entity.getName(), entity.getRole(), secure, active);
                    }).toList();
                });
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
