package com.github.blaszczyk.ramschi.ramschi_server.service;

import com.github.blaszczyk.ramschi.ramschi_server.domain.Role;

public record AuthInfo (String name, Role role) {

    public static AuthInfo FAIL = new AuthInfo(null, null);

    public static AuthInfo success(String name, Role role) {
        return new AuthInfo(name, role);
    }

    public boolean hasRole(Role requiredRole) {
        return role() != null && role().includes(requiredRole);
    }
}
