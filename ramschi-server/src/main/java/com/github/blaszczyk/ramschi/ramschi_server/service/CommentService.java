package com.github.blaszczyk.ramschi.ramschi_server.service;

import com.github.blaszczyk.ramschi.ramschi_server.domain.Comment;
import com.github.blaszczyk.ramschi.ramschi_server.persistence.CommentEntity;
import com.github.blaszczyk.ramschi.ramschi_server.persistence.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public Mono<List<Comment>> getComments(UUID itemId) {
        return commentRepository.findByItemIdOrderByLastEditDesc(itemId)
                .map(CommentService::toComment)
                .collectList();
    }

    public Mono<Comment> saveComment(Comment comment) {
        final var entity = new CommentEntity();
        entity.setId(comment.id());
        entity.setItemId(comment.itemId());
        entity.setAuthor(comment.author());
        entity.setText(comment.text());
        entity.setLastEdit(LocalDateTime.now());
        return commentRepository.save(entity)
                .map(CommentService::toComment);
    }

    private static Comment toComment(CommentEntity entity) {
            return new Comment(entity.getId(), entity.getItemId(), entity.getAuthor(), entity.getText(), entity.getLastEdit());
    }
}
