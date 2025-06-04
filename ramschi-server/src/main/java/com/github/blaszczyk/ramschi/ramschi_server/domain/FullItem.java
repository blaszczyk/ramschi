package com.github.blaszczyk.ramschi.ramschi_server.domain;

import java.util.List;
import java.util.UUID;

public record FullItem(
        UUID id,
        String name,
        String description,
        String category,
        int price,
        boolean sold,
        List<String> assignees,
        List<UUID> images,
        List<Comment> comments
    ) {
}
