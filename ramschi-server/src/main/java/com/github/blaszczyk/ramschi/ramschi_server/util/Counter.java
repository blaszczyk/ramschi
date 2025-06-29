package com.github.blaszczyk.ramschi.ramschi_server.util;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collector;

public class Counter<K> {

    public static <T, P> Collector<T, Counter<P>, Counter<P>> countByProperty(Function<T, P> getter) {
        return Collector.of(Counter::new,
                (c, t) -> c.add(getter.apply(t), 1),
                Counter::absorb);
    }

    private final Map<K, Integer> map = new HashMap<>();

    public int get(K key) {
        return map.getOrDefault(key, 0);
    }

    public void add(K key, int summand) {
        map.put(key, get(key) + summand);
    }

    public Counter<K> absorb(Counter<K> other) {
        other.map.forEach(this::add);
        return this;
    }

}