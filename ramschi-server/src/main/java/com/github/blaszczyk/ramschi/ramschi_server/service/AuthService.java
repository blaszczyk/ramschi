package com.github.blaszczyk.ramschi.ramschi_server.service;

import com.github.blaszczyk.ramschi.ramschi_server.domain.LoginResponse;
import com.github.blaszczyk.ramschi.ramschi_server.persistence.AssigneeEntity;
import com.github.blaszczyk.ramschi.ramschi_server.persistence.AssigneeRepository;
import com.github.blaszczyk.ramschi.ramschi_server.domain.Role;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;

import static com.github.blaszczyk.ramschi.ramschi_server.service.AuthInfo.*;
import static reactor.core.publisher.Mono.just;

@Service
public class AuthService {

    private static final int SALT_LENGTH = 16;

    @Autowired
    private AssigneeRepository assigneeRepository;

    public Mono<AuthInfo> getAuthInfo(String ramschiAuthString) {
        if (StringUtils.isBlank(ramschiAuthString)) {
            return just(FAIL);
        }
        final RamschiAuth auth = parse(ramschiAuthString);
        return assigneeRepository.findByName(auth.name()).map(entity -> {
            if (hasPassword(entity)) {
                if (passwordMatches(auth, entity)) {
                    return success(entity.getName(), entity.getRole());
                }
                else {
                    return FAIL;
                }
            }
            else {
                return success(entity.getName(), Role.ASSIGNEE);
            }
        }).switchIfEmpty(just(FAIL));
    }

    public Mono<LoginResponse> login(String ramschiAuthString) {
        final RamschiAuth auth = parse(ramschiAuthString);

        return assigneeRepository.findByName(auth.name()).flatMap(entity -> {
            final LoginResponse response = LoginResponse.from(entity);
            if (hasPassword(entity)) {
                if (passwordMatches(auth, entity)) {
                    return just(response);
                }
                else {
                    return just(LoginResponse.FAIL);
                }
            }
            else {
                if (auth.hasPassword()) {
                    return storePassword(auth).thenReturn(response);
                }
                else {
                    return just(response);
                }
            }
        }).switchIfEmpty(createNewAssignee(auth));
    }

    private Mono<LoginResponse> createNewAssignee(RamschiAuth auth) {
        final AssigneeEntity entity = new AssigneeEntity();
        entity.setName(auth.name());
        entity.setRole(Role.ASSIGNEE);

        final LoginResponse response = LoginResponse.from(entity);
        return assigneeRepository.save(entity).flatMap(ignore -> {
            if (auth.hasPassword()) {
                return storePassword(auth).thenReturn(response);
            }
            else {
                return just(response);
            }
        });
    }

    private Mono<AssigneeEntity> storePassword(RamschiAuth auth) {
        final byte[] salt = generateSalt();
        final byte[] passwordSHA256 = addSaltAndDigestSHA256(auth.password(), salt);
        return assigneeRepository.setPassword(auth.name(), passwordSHA256, salt);
    }

    private static boolean hasPassword(AssigneeEntity entity) {
        return entity.getPasswordSHA256() != null && entity.getPasswordSHA256().length > 0;
    }

    private static byte[] generateSalt() {
        final byte[] salt = new byte[SALT_LENGTH];
        new SecureRandom().nextBytes(salt);
        return salt;
    }

    private static boolean passwordMatches(RamschiAuth auth, AssigneeEntity entity) {
        final byte[] salt = entity.getSalt();
        final byte[] passwordSHA256 = addSaltAndDigestSHA256(auth.password(), salt);
        return Arrays.equals(passwordSHA256, entity.getPasswordSHA256());
    }

    private static byte[] addSaltAndDigestSHA256(byte[] password, byte[] salt) {
        final byte[] pwAndSalt = Arrays.copyOf(password, password.length + salt.length);
        System.arraycopy(salt, 0, pwAndSalt, password.length, salt.length);
        try {
            return MessageDigest.getInstance("SHA256").digest(pwAndSalt);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    public static RamschiAuth parse(String ramschiAuth) {
        final byte[] decodedBytes = Base64.getDecoder().decode(ramschiAuth);
        final String decodedHex = new String(decodedBytes, StandardCharsets.UTF_8);
        final String decoded = hexToUtf8(decodedHex);
        final String[] split = decoded.split(":", 2);
        if (split.length > 1) {
            return new RamschiAuth(split[0], split[1].getBytes(StandardCharsets.UTF_8));
        }
        else {
            return new RamschiAuth(decoded, new byte[0]);
        }
    }

    private record RamschiAuth(String name, byte[] password) {
        boolean hasPassword() {
            return password.length > 0;
        }
    }

    private static String hexToUtf8(String hex) {
        final int length = hex.length();
        final byte[] bytes = new byte[length / 2];

        for (int i = 0; i < length; i += 2) {
            int byteValue = Integer.parseInt(hex.substring(i, i + 2), 16);
            bytes[i / 2] = (byte) byteValue;
        }

        return new String(bytes, StandardCharsets.UTF_8);
    }
}
