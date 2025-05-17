package com.github.blaszczyk.ramschi.ramschi_server.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RequestPredicate;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

import java.net.URI;
import java.util.List;

import static org.springframework.web.reactive.function.server.RequestPredicates.GET;
import static org.springframework.web.reactive.function.server.RouterFunctions.route;
import static org.springframework.web.reactive.function.server.ServerResponse.ok;

@Configuration
public class RouterConfig {

    private static final String BASE_PATH = "/";

    private static final List<String> INDEX_PATHS = List.of("/ramsch/**", "/admin/**");

    @Bean
    public RouterFunction<ServerResponse> indexRouter(@Value("classpath:/static/index.html") final Resource indexHtml) {
        RequestPredicate conjunction = GET(BASE_PATH);
        for (String path : INDEX_PATHS) {
            conjunction = conjunction.or(GET(path));
        }
        return route(conjunction, request ->
                ok()
                .contentType(MediaType.TEXT_HTML)
                .bodyValue(indexHtml)
        );
    }
}
