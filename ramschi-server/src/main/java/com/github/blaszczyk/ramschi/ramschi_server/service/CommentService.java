package com.github.blaszczyk.ramschi.ramschi_server.service;

import com.github.blaszczyk.ramschi.ramschi_server.domain.Comment;
import com.github.blaszczyk.ramschi.ramschi_server.persistence.CommentEntity;
import com.github.blaszczyk.ramschi.ramschi_server.persistence.CommentRepository;
import com.github.blaszczyk.ramschi.ramschi_server.persistence.ItemTransformer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class CommentService {

    private static Logger LOG = LoggerFactory.getLogger(CommentService.class);

    @Autowired
    private CommentRepository commentRepository;

    public Mono<Comment> saveComment(Comment comment) {
        LOG.info("New {}", comment);
        final var entity = new CommentEntity();
        entity.setId(comment.id());
        entity.setItemId(comment.itemId());
        entity.setAuthor(comment.author());
        entity.setText(comment.text());
        entity.setLastEdit(LocalDateTime.now());
        return commentRepository.save(entity)
                .map(ItemTransformer::toComment);
    }

    public Mono<String> getAuthor(UUID id) {
        return commentRepository.findAuthorById(id);
    }

    public Mono<Void> deleteComment(UUID id) {
        return commentRepository.deleteById(id);
    }
}
