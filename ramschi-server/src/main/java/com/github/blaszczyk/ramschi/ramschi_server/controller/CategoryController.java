package com.github.blaszczyk.ramschi.ramschi_server.controller;

import com.github.blaszczyk.ramschi.ramschi_server.domain.Category;
import com.github.blaszczyk.ramschi.ramschi_server.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/api/category")
@ResponseBody
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping(path = "",
            produces = MediaType.APPLICATION_JSON_VALUE)
    Mono<ResponseEntity<List<Category>>> getCategories() {
        return categoryService.getAllCategories()
                .map(ResponseEntity::ok);
    }


    @PostMapping(path = "",
            consumes = MediaType.APPLICATION_JSON_VALUE)
    Mono<ResponseEntity<Void>> postCategory(@RequestBody Category category) {
        return categoryService.createCategory(category)
                .map(ResponseEntity::ok);
    }
}
