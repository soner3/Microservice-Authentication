package com.example.cofidential_client.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity.CsrfSpec;
import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestCustomizers;
import org.springframework.security.oauth2.client.web.server.DefaultServerOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.server.ServerOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;

import com.example.cofidential_client.filter.CookieToAuthorizationHeaderFilter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Configuration
@EnableWebFluxSecurity
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig {

        private final ReactiveClientRegistrationRepository clientRegistrationRepository;
        private final CustomAuthSuccessHandler customAuthSuccessHandler;

        @Bean
        SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
                http
                                .authorizeExchange(exchange -> exchange
                                                .pathMatchers("/app/**").hasRole("Ressources")
                                                .anyExchange().permitAll())
                                .csrf(CsrfSpec::disable)
                                .addFilterBefore(new CookieToAuthorizationHeaderFilter(),
                                                SecurityWebFiltersOrder.AUTHENTICATION)
                                .oauth2Login(oauth -> oauth
                                                .authenticationSuccessHandler(customAuthSuccessHandler)
                                                .authorizationRequestResolver(requestResolver()))
                                .oauth2Client(Customizer.withDefaults())
                                .oauth2ResourceServer(oauth -> oauth
                                                .jwt(jwt -> jwt.jwtAuthenticationConverter(
                                                                grantedAuthoritiesConverter())));

                return http.build();
        }

        @Bean
        ServerOAuth2AuthorizationRequestResolver requestResolver() {
                DefaultServerOAuth2AuthorizationRequestResolver resolver = new DefaultServerOAuth2AuthorizationRequestResolver(
                                clientRegistrationRepository);
                resolver.setAuthorizationRequestCustomizer(OAuth2AuthorizationRequestCustomizers.withPkce());
                return resolver;
        }

        @Bean
        Converter<Jwt, Mono<AbstractAuthenticationToken>> grantedAuthoritiesConverter() {
                JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
                jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(new KeyCloakRoleConverter());
                return new ReactiveJwtAuthenticationConverterAdapter(jwtAuthenticationConverter);
        }

}