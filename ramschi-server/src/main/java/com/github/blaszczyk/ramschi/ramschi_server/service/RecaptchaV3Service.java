package com.github.blaszczyk.ramschi.ramschi_server.service;

import com.google.cloud.recaptchaenterprise.v1.RecaptchaEnterpriseServiceClient;
import com.google.recaptchaenterprise.v1.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import com.google.recaptchaenterprise.v1.RiskAnalysis.ClassificationReason;
import java.io.IOException;
import java.util.stream.Collectors;

@Service
public class RecaptchaV3Service {

    private static Logger LOG = LoggerFactory.getLogger(RecaptchaV3Service.class);

    @Value("ramschi")
    private String projectId;

    // TODO: config
    @Value("6Ldvbz4rAAAAAD0o0n1e0PVsvfkPwr3HaSeA6FIu")
    private String recaptchaKey;

    public Mono<Boolean> verify(String token, String action) {
        try (RecaptchaEnterpriseServiceClient client = RecaptchaEnterpriseServiceClient.create()) {
            final Event event = Event.newBuilder()
                    .setSiteKey(recaptchaKey)
                    .setToken(token)
                    .build();

            final CreateAssessmentRequest createAssessmentRequest =
                    CreateAssessmentRequest.newBuilder()
                            .setParent(ProjectName.of(projectId).toString())
                            .setAssessment(Assessment.newBuilder().setEvent(event).build())
                            .build();

            final Assessment response = client.createAssessment(createAssessmentRequest);
            final TokenProperties tokenProperties = response.getTokenProperties();

            if (!response.getTokenProperties().getValid()) {
                LOG.warn("Invalid token {}", tokenProperties.getInvalidReason().name());
                return Mono.just(Boolean.FALSE);
            }

            if (!tokenProperties.getAction().equals(action)) {
                LOG.warn("Wrong action '{}', expected '{}'", tokenProperties.getAction(), action);
                return Mono.just(Boolean.FALSE);
            }

            final String reasons = response.getRiskAnalysis()
                    .getReasonsList()
                    .stream()
                    .filter(r -> r != ClassificationReason.LOW_CONFIDENCE_SCORE)
                    .map(ClassificationReason::toString)
                    .collect(Collectors.joining(", "));
            LOG.warn("Reasons: {}", reasons);

            final float recaptchaScore = response.getRiskAnalysis().getScore();
            LOG.info("Score {} for {}", recaptchaScore, action);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return Mono.just(Boolean.TRUE);
    }
}