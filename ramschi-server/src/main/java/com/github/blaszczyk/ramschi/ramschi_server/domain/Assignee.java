package com.github.blaszczyk.ramschi.ramschi_server.domain;

public record Assignee(String name, Role role, boolean secure, int itemCount, int commentCount) {
}
