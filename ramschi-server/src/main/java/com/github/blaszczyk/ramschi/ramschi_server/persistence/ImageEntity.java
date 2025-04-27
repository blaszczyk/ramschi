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

    private byte[] data;

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

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ImageEntity that)) return false;
        return Objects.equals(id, that.id) && Objects.equals(itemId, that.itemId) && Objects.deepEquals(data, that.data);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, itemId, Arrays.hashCode(data));
    }
}
