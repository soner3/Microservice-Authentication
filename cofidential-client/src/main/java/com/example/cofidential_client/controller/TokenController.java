package com.example.cofidential_client.controller;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.web.server.ServerOAuth2AuthorizedClientRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ServerWebExchange;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
public class TokenController {

        private final ServerOAuth2AuthorizedClientRepository clientRepository;
        private final String CLIENT_ID = "keycloak-oidc";
        private final String ACCESS_COOKIE_NAME = "access_token";

        @PostMapping("/token/refresh")
        Mono<ResponseEntity<String>> refreshToken(ServerWebExchange exchange, Authentication authentication) {

                return clientRepository.loadAuthorizedClient(CLIENT_ID, authentication, exchange)
                                .flatMap(authorizedClient -> {

                                        String newAccessToken = authorizedClient.getAccessToken().getTokenValue();
                                        long maxAge = authorizedClient.getAccessToken().getExpiresAt().toEpochMilli()
                                                        - Instant.now().toEpochMilli();

                                        exchange.getResponse()
                                                        .addCookie(createAccessTokenCookie(newAccessToken, maxAge));

                                        return Mono.just(ResponseEntity.ok("Access token refreshed successfully"));
                                })
                                .switchIfEmpty(Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                                .body("No authorized client found")));
        }

        private ResponseCookie createAccessTokenCookie(String accessToken, long maxAge) {
                return ResponseCookie.from(ACCESS_COOKIE_NAME, accessToken)
                                .httpOnly(true)
                                .secure(false)
                                .path("/")
                                .maxAge(maxAge)
                                .sameSite("Lax")
                                .build();
        }
}
