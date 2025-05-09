package com.github.blaszczyk.ramschi.ramschi_server.persistence;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Table("comment")
public class CommentEntity {

    @Id
    private UUID id;

    private UUID itemId;

    private String author;

    private String text;

    private LocalDateTime lastEdit;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getItemId() {
        return itemId;
    }

    public void setItemId(UUID itemId) {
        this.itemId = itemId;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public LocalDateTime getLastEdit() {
        return lastEdit;
    }

    public void setLastEdit(LocalDateTime lastEdit) {
        this.lastEdit = lastEdit;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CommentEntity that)) return false;
        return Objects.equals(id, that.id) && Objects.equals(itemId, that.itemId) && Objects.equals(author, that.author) && Objects.equals(text, that.text) && Objects.equals(lastEdit, that.lastEdit);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, itemId, author, text, lastEdit);
    }
}
