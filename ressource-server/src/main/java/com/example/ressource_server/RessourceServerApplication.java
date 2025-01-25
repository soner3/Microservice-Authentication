package com.example.ressource_server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ressource_server.dto.MessageDto;

import lombok.extern.slf4j.Slf4j;

@SpringBootApplication
@RestController
@Slf4j
public class RessourceServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(RessourceServerApplication.class, args);
	}

	@GetMapping("/message")
	public ResponseEntity<MessageDto> getMessage() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		log.info("Currently logged in user: {}", authentication.getName());
		return ResponseEntity.ok(new MessageDto("Hello World"));
	}

}
