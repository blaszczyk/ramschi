package com.github.blaszczyk.ramschi.ramschi_server.persistence;

import com.github.blaszczyk.ramschi.ramschi_server.domain.Role;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.Arrays;
import java.util.Objects;

@Table("assignee")
public class AssigneeEntity {

    private String name;

    @Column("password-sha256")
    private byte[] passwordSHA256;

    private byte[] salt;

    private Role role;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getPasswordSHA256() {
        return passwordSHA256;
    }

    public void setPasswordSHA256(byte[] passwordSHA256) {
        this.passwordSHA256 = passwordSHA256;
    }

    public byte[] getSalt() {
        return salt;
    }

    public void setSalt(byte[] salt) {
        this.salt = salt;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AssigneeEntity that)) return false;
        return Objects.equals(name, that.name) && Objects.deepEquals(passwordSHA256, that.passwordSHA256) && Objects.deepEquals(salt, that.salt) && role == that.role;
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, Arrays.hashCode(passwordSHA256), Arrays.hashCode(salt), role);
    }
}
