package com.github.blaszczyk.ramschi.ramschi_server.domain;

import com.github.blaszczyk.ramschi.ramschi_server.persistence.AssigneeEntity;

public record LoginResponse(boolean success, Role role) {

    public static LoginResponse FAIL = new LoginResponse(false, null);

    public static LoginResponse from(AssigneeEntity entity) {
        return new LoginResponse(true, entity.getRole());
    }
}
