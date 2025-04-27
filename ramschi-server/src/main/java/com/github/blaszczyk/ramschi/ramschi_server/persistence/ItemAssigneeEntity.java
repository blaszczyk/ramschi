package com.github.blaszczyk.ramschi.ramschi_server.persistence;

import org.springframework.data.relational.core.mapping.Table;

import java.util.Objects;
import java.util.UUID;

@Table("item_assignee")
public class ItemAssigneeEntity {

    private UUID itemId;

    private String assignee;

    public UUID getItemId() {
        return itemId;
    }

    public void setItemId(UUID itemId) {
        this.itemId = itemId;
    }

    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ItemAssigneeEntity that)) return false;
        return Objects.equals(itemId, that.itemId) && Objects.equals(assignee, that.assignee);
    }

    @Override
    public int hashCode() {
        return Objects.hash(itemId, assignee);
    }
}
