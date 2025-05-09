package com.github.blaszczyk.ramschi.ramschi_server.domain;

import java.time.LocalDateTime;
import java.util.UUID;

public record Comment(UUID id, UUID itemId, String author, String text, LocalDateTime lastEdit) {
}
