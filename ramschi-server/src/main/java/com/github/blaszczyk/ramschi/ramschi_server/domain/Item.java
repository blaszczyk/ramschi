package com.github.blaszczyk.ramschi.ramschi_server.domain;

import java.util.List;
import java.util.UUID;

public record Item(
        UUID id,
        String name,
        String description,
        String category,
        long lastedit,
        boolean sold,
        List<String> assignees,
        List<UUID> images
    ) {
}
