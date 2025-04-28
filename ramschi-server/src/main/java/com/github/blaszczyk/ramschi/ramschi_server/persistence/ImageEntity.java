package com.github.blaszczyk.ramschi.ramschi_server.persistence;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.util.Arrays;
import java.util.Objects;
import java.util.UUID;

@Table("image")
public class ImageEntity {

    @Id
    private UUID id;

    private UUID itemId;

    private byte[] original;

    private byte[] thumbnail;

    private byte[] preview;

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

    public byte[] getOriginal() {
        return original;
    }

    public void setOriginal(byte[] original) {
        this.original = original;
    }

    public byte[] getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(byte[] thumbnail) {
        this.thumbnail = thumbnail;
    }

    public byte[] getPreview() {
        return preview;
    }

    public void setPreview(byte[] preview) {
        this.preview = preview;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ImageEntity that)) return false;
        return Objects.equals(id, that.id) && Objects.equals(itemId, that.itemId) && Objects.deepEquals(original, that.original) && Objects.deepEquals(thumbnail, that.thumbnail) && Objects.deepEquals(preview, that.preview);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, itemId, Arrays.hashCode(original), Arrays.hashCode(thumbnail), Arrays.hashCode(preview));
    }
}
