package com.github.blaszczyk.ramschi.ramschi_server.controller;

import com.github.blaszczyk.ramschi.ramschi_server.controller.util.AuthHelper;
import com.github.blaszczyk.ramschi.ramschi_server.domain.Comment;
import com.github.blaszczyk.ramschi.ramschi_server.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/api/comment")
@ResponseBody
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private AuthHelper authHelper;

    @PostMapping(path = "",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    Mono<ResponseEntity<Comment>> postComment(@RequestBody Comment comment, @RequestHeader(RamschiHeader.AUTH) String ramschiAuth) {
        return authHelper.doIfAuthorised(ramschiAuth, comment.author(), () ->
                commentService.saveComment(comment)
                        .map(ResponseEntity::ok)
        );
    }

    @DeleteMapping(path = "/{id}")
    Mono<ResponseEntity<Void>> deleteComment(
            @PathVariable UUID id,
            @RequestHeader(RamschiHeader.AUTH) String ramschiAuth) {
        return commentService.getAuthor(id)
                .flatMap(author ->
                        authHelper.doIfAuthorised(ramschiAuth, author, () ->
                            commentService.deleteComment(id)
                                    .map(ResponseEntity::ok)
                        )
                );
    }
}
