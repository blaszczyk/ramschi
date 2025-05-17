package com.github.blaszczyk.ramschi.ramschi_server.domain;

public enum Role {
    ASSIGNEE(1),
    CONTRIBUTOR(10),
    ADMIN(100);

    private final int hierarchy;

    Role(int hierarchy) {
        this.hierarchy = hierarchy;
    }

    public boolean includes(Role other) {
        return this.hierarchy >= other.hierarchy;
    }
}
