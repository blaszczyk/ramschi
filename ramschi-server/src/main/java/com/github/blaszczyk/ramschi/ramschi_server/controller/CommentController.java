package com.github.blaszczyk.ramschi.ramschi_server.controller;

import com.github.blaszczyk.ramschi.ramschi_server.controller.util.AuthHelper;
import com.github.blaszczyk.ramschi.ramschi_server.controller.util.RecaptchaV3Helper;
import com.github.blaszczyk.ramschi.ramschi_server.domain.Comment;
import com.github.blaszczyk.ramschi.ramschi_server.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/comment")
@ResponseBody
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private AuthHelper authHelper;

    @Autowired
    private RecaptchaV3Helper recaptchaV3Helper;

    @GetMapping(path = "/{itemId}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    Mono<ResponseEntity<List<Comment>>> getCommentsForItem(
            @PathVariable UUID itemId
    ) {
        return commentService.getComments(itemId)
                .map(ResponseEntity::ok);
    }

    @PostMapping(path = "",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    Mono<ResponseEntity<Comment>> postComment(@RequestBody Comment comment,
                                              @RequestHeader(RamschiHeader.RECAPTCHA) String token,
                                              @RequestHeader(RamschiHeader.AUTH) String ramschiAuth) {
        return recaptchaV3Helper.doIfHuman(token, "comment", () ->
                authHelper.doIfAuthorised(ramschiAuth, comment.author(), () ->
                    commentService.saveComment(comment)
                            .map(ResponseEntity::ok)
                )
        );
    }

    @DeleteMapping(path = "/{id}")
    Mono<ResponseEntity<Void>> deleteComment(
            @PathVariable UUID id,
            @RequestHeader(RamschiHeader.AUTH) String ramschiAuth) {
        return commentService.getComment(id)
                .flatMap(comment ->
                        authHelper.doIfAuthorised(ramschiAuth, comment.author(), () ->
                            commentService.deleteComment(id)
                                    .map(ResponseEntity::ok)
                        )
                );
    }
}
