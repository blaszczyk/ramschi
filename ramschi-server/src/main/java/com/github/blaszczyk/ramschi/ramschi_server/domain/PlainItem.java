package com.github.blaszczyk.ramschi.ramschi_server.domain;

import java.util.UUID;

public record PlainItem(UUID id, String name, String description, String category, boolean sold) {
}
