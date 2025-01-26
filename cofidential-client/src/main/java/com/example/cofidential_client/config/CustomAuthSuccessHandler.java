package com.example.cofidential_client.config;

import java.time.Instant;

import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.web.server.ServerOAuth2AuthorizedClientRepository;
import org.springframework.security.web.server.WebFilterExchange;
import org.springframework.security.web.server.authentication.RedirectServerAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class CustomAuthSuccessHandler extends RedirectServerAuthenticationSuccessHandler {

        private final ServerOAuth2AuthorizedClientRepository authorizedClientRepository;
        private final String ACCESS_COOKIE_NAME = "access_token";
        private final String CLIENT_ID = "keycloak-oidc";

        @Override
        public Mono<Void> onAuthenticationSuccess(WebFilterExchange webFilterExchange, Authentication authentication) {

                return this.authorizedClientRepository.loadAuthorizedClient(
                                CLIENT_ID,
                                authentication,
                                webFilterExchange.getExchange())
                                .flatMap(authorizedClient -> {
                                        String accessToken = authorizedClient.getAccessToken().getTokenValue();
                                        Instant accessTokenExpiry = authorizedClient.getAccessToken().getExpiresAt();
                                        long accessMaxAge = accessTokenExpiry.getEpochSecond()
                                                        - Instant.now().getEpochSecond();

                                        ResponseCookie accessTokenCookie = createResponseCookie(ACCESS_COOKIE_NAME,
                                                        accessToken, accessMaxAge);

                                        webFilterExchange.getExchange().getResponse().addCookie(accessTokenCookie);

                                        return super.onAuthenticationSuccess(webFilterExchange, authentication);
                                });
        }

        private ResponseCookie createResponseCookie(String key, String value, long maxAge) {
                return ResponseCookie
                                .from(key, value)
                                .httpOnly(true)
                                .secure(false)
                                .path("/")
                                .maxAge(maxAge)
                                .sameSite("Lax")
                                .build();
        }

}
