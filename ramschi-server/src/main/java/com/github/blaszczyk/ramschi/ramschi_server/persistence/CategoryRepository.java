package com.github.blaszczyk.ramschi.ramschi_server.persistence;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface CategoryRepository extends ReactiveCrudRepository<CategoryEntity, String> {

}
