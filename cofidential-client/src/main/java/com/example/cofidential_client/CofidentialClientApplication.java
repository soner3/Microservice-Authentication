package com.example.cofidential_client;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CofidentialClientApplication {

	public static void main(String[] args) {
		SpringApplication.run(CofidentialClientApplication.class, args);
	}

	@Bean
	RouteLocator routeLocator(RouteLocatorBuilder routeLocatorBuilder) {
		return routeLocatorBuilder.routes()
				.route(p -> p
						.path("/app/**")
						.filters(f -> f.rewritePath("/app/(?<segment>.*)", "/${segment}"))
						.uri("http://localhost:8070"))
				.route(p -> p
						.path("/**")
						.uri("http://localhost:3000"))
				.build();
	}

}
