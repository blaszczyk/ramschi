package com.github.blaszczyk.ramschi.ramschi_server.service;

import com.github.blaszczyk.ramschi.ramschi_server.persistence.AssigneeEntity;
import com.github.blaszczyk.ramschi.ramschi_server.domain.Role;
import org.apache.commons.lang3.StringUtils;

public class AuthInfo {

    public static AuthInfo FAIL = new AuthInfo(null, null);

    public static AuthInfo success(String name, Role role) {
        return new AuthInfo(name, role);
    }
    private final String name;
    private final Role role;

    private AuthInfo(String name, Role role) {
        this.name = name;
        this.role = role;
    }

    public boolean isAdmin() {
        return role == Role.ADMIN;
    }

    public boolean isContributor() {
        return role == Role.CONTRIBUTOR || role == Role.ADMIN;
    }

    public boolean isAssignee(String assignee) {
        return StringUtils.equals(assignee, name) || role == Role.ADMIN;
    }

    public Role getRole() {
        return role;
    }
}
