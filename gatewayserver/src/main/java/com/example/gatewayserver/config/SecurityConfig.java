package com.example.gatewayserver.config;

import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity.CsrfSpec;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.server.ServerWebExchange;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Configuration
@EnableWebFluxSecurity
@Slf4j
public class SecurityConfig {

        @Bean
        SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
                http
                                .authorizeExchange(exchange -> exchange
                                                .pathMatchers("/app/**").hasRole("Ressources")
                                                .pathMatchers("/api/auth/refresh/**").permitAll()
                                                .anyExchange().permitAll())
                                .csrf(CsrfSpec::disable)
                                .cors(corsConfig -> corsConfig.configurationSource(new CorsConfigurationSource() {

                                        @Override
                                        public CorsConfiguration getCorsConfiguration(ServerWebExchange exchange) {
                                                CorsConfiguration config = new CorsConfiguration();
                                                config.setAllowedOrigins(
                                                                Collections.singletonList("http://localhost:3000"));
                                                config.setAllowedMethods(Collections.singletonList("*"));
                                                config.setAllowCredentials(true);
                                                config.setAllowedHeaders(Collections.singletonList("*"));
                                                config.setMaxAge(3600L);
                                                return config;
                                        }

                                }))
                                .oauth2ResourceServer(oauth -> oauth
                                                .jwt(jwt -> jwt.jwtAuthenticationConverter(
                                                                grantedAuthoritiesConverter())));
                return http.build();
        }

        @Bean
        Converter<Jwt, Mono<AbstractAuthenticationToken>> grantedAuthoritiesConverter() {
                JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
                jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(new KeyCloakRoleConverter());
                return new ReactiveJwtAuthenticationConverterAdapter(jwtAuthenticationConverter);
        }

}