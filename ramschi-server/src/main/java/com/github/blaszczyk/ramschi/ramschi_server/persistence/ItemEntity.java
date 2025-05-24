package com.github.blaszczyk.ramschi.ramschi_server.persistence;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Table("item")
public class ItemEntity {

    @Id
    private UUID id;

    private String name;

    private String description;

    private String category;

    private int price;

    private LocalDateTime lastedit;

    private boolean sold;

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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
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

    public boolean isSold() {
        return sold;
    }

    public void setSold(boolean sold) {
        this.sold = sold;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ItemEntity entity)) return false;
        return price == entity.price && sold == entity.sold && Objects.equals(id, entity.id) && Objects.equals(name, entity.name) && Objects.equals(description, entity.description) && Objects.equals(category, entity.category) && Objects.equals(lastedit, entity.lastedit);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, description, category, price, lastedit, sold);
    }
}
