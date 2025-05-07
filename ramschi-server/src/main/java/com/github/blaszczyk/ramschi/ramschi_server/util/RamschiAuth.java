package com.github.blaszczyk.ramschi.ramschi_server.util;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class RamschiAuth {

    public static RamschiAuth parse(String ramschiAuth) {
        final byte[] decodedBytes = Base64.getDecoder().decode(ramschiAuth);
        final String decoded = new String(decodedBytes, StandardCharsets.UTF_8);
        final String[] split = decoded.split(":", 2);
        if (split.length > 1) {
            return new RamschiAuth(split[0], split[1].getBytes(StandardCharsets.UTF_8));
        }
        else {
            return new RamschiAuth(decoded, new byte[0]);
        }
    }

    private final String name;

    private final byte[] password;

    private RamschiAuth(String name, byte[] password) {
        this.name = name;
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public byte[] getPassword() {
        return password;
    }

    public boolean hasPassword() {
        return password.length > 0;
    }
}
