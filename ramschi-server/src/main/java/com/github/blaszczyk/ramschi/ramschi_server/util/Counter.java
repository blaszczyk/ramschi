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

    private final Map<K, int[]> map = new HashMap<>();

    private Counter() {}

    public int get(final K key) {
        return getInternal(key)[0];
    }

    private int[] getInternal(final K key) {
        if (!map.containsKey(key)) {
            map.put(key, new int[]{0});
        }
        return map.get(key);
    }

    private void add(final K key, final int summand) {
        getInternal(key)[0]+=summand;
    }

    private Counter<K> absorb(final Counter<K> other) {
        other.map.forEach((key, count) -> add(key, count[0]));
        return this;
    }

}