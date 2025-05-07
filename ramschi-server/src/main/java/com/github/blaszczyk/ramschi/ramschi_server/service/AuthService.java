package com.github.blaszczyk.ramschi.ramschi_server.service;

import com.github.blaszczyk.ramschi.ramschi_server.domain.LoginResponse;
import com.github.blaszczyk.ramschi.ramschi_server.persistence.AssigneeEntity;
import com.github.blaszczyk.ramschi.ramschi_server.persistence.AssigneeRepository;
import com.github.blaszczyk.ramschi.ramschi_server.domain.Role;
import com.github.blaszczyk.ramschi.ramschi_server.util.RamschiAuth;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Arrays;

@Service
public class AuthService {

    private static final int SALT_LENGTH = 16;

    @Autowired
    private AssigneeRepository assigneeRepository;

    private Mono<AssigneeEntity> setPassword(RamschiAuth auth) {
        final byte[] salt = generateSalt();
        final byte[] passwordSHA256 = addSaltAndDigestSHA256(auth.getPassword(), salt);
        return assigneeRepository.setPassword(auth.getName(), passwordSHA256, salt);
    }

    public Mono<LoginResponse> login(String ramschiAuthString) {
        final RamschiAuth auth = RamschiAuth.parse(ramschiAuthString);

        final AssigneeEntity newEntity = new AssigneeEntity();
        newEntity.setName(auth.getName());
        newEntity.setRole(Role.ASSIGNEE);
        final LoginResponse response = LoginResponse.from(newEntity);
        final Mono<LoginResponse> onEmpty = assigneeRepository.save(newEntity).flatMap(e -> {
            if (auth.hasPassword()) {
                return setPassword(auth).thenReturn(response);
            }
            else {
                return Mono.just(response);
            }
        });

        return assigneeRepository.findByName(auth.getName()).flatMap(entity -> {
            if (hasPassword(entity)) {
                if (verifyPassword(auth, entity)) {
                    return Mono.just(LoginResponse.from(entity));
                }
                else {
                    return Mono.just(LoginResponse.FAIL);
                }
            }
            else {
                if (auth.hasPassword()) {
                    return setPassword(auth).thenReturn(LoginResponse.from(entity));
                }
                else {
                    return Mono.just(LoginResponse.from(entity));
                }
            }
        }).switchIfEmpty(onEmpty);
    }

    public Mono<AuthInfo> getAuthInfo(String ramschiAuthString) {
        if (StringUtils.isBlank(ramschiAuthString)) {
            return Mono.just(AuthInfo.FAIL);
        }
        final RamschiAuth auth = RamschiAuth.parse(ramschiAuthString);
        return assigneeRepository.findByName(auth.getName()).map(entity -> {
            if (hasPassword(entity)) {
                if (verifyPassword(auth, entity)) {
                    return AuthInfo.success(entity.getName(), entity.getRole());
                }
                else {
                    return AuthInfo.FAIL;
                }
            }
            else {
                return AuthInfo.success(entity.getName(), Role.ASSIGNEE);
            }
        }).switchIfEmpty(Mono.just(AuthInfo.FAIL));
    }

    private static boolean hasPassword(AssigneeEntity entity) {
        return entity.getPasswordSHA256() != null && entity.getPasswordSHA256().length > 0;
    }

    private static byte[] generateSalt() {
        final byte[] salt = new byte[SALT_LENGTH];
        new SecureRandom().nextBytes(salt);
        return salt;
    }

    private static boolean verifyPassword(RamschiAuth auth, AssigneeEntity entity) {
        final byte[] salt = entity.getSalt();
        final byte[] passwordSHA256 = addSaltAndDigestSHA256(auth.getPassword(), salt);
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
}
