package com.github.blaszczyk.ramschi.ramschi_server.domain;

import java.util.List;
import java.util.UUID;

public record Item(
        UUID id,
        String name,
        String description,
        String category,
        int price,
        long lastedit,
        List<String> assignees,
        List<UUID> images
    ) {
}
