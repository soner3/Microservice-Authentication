package com.example.gatewayserver.config;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

public class KeyCloakRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    @Override
    public Collection<GrantedAuthority> convert(Jwt source) {
        @SuppressWarnings("unchecked")
        Map<String, Map<String, List<String>>> ressourceAccess = (Map<String, Map<String, List<String>>>) source
                .getClaims().get("resource_access");
        if (ressourceAccess == null || ressourceAccess.isEmpty()) {
            return new ArrayList<>();
        }
        Map<String, List<String>> realmName = ressourceAccess.get("oauth-client");
        if (realmName == null || realmName.isEmpty()) {
            return new ArrayList<>();
        }

        Collection<GrantedAuthority> authorities = realmName
                .get("roles")
                .stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        return authorities;

    }

}
