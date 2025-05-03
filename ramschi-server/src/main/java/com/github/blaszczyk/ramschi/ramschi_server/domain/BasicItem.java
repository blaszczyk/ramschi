package com.github.blaszczyk.ramschi.ramschi_server.domain;

import java.util.List;
import java.util.UUID;

public record BasicItem(UUID id, String name, String description, String category, int price) {
}
