package com.github.blaszczyk.ramschi.ramschi_server.persistence;

import com.github.blaszczyk.ramschi.ramschi_server.domain.Category;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Table("item")
public class ItemEntity {

    @Id
    private UUID id;

    private String name;

    private String description;

    private Category category;

    private int price;

    private LocalDateTime lastedit;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public LocalDateTime getLastedit() {
        return lastedit;
    }

    public void setLastedit(LocalDateTime lastedit) {
        this.lastedit = lastedit;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ItemEntity entity)) return false;
        return price == entity.price && Objects.equals(id, entity.id) && Objects.equals(name, entity.name) && Objects.equals(description, entity.description) && category == entity.category && Objects.equals(lastedit, entity.lastedit);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, description, category, price, lastedit);
    }
}
