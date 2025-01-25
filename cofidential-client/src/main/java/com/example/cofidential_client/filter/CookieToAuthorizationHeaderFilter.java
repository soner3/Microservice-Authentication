package com.example.cofidential_client.filter;

import org.springframework.http.HttpCookie;
import org.springframework.http.HttpHeaders;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;

import reactor.core.publisher.Mono;

public class CookieToAuthorizationHeaderFilter implements WebFilter {

    private final String ACCESS_COOKIE_NAME = "access_token";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        HttpCookie cookie = exchange.getRequest().getCookies().getFirst(ACCESS_COOKIE_NAME);
        if (cookie != null) {
            String accessToken = cookie.getValue() != null ? cookie.getValue() : "";
            ServerWebExchange mutatedExchange = exchange.mutate()
                    .request(
                            exchange.getRequest()
                                    .mutate()
                                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                                    .build())
                    .build();
            return chain.filter(mutatedExchange);
        }
        return chain.filter(exchange);
    }

}
