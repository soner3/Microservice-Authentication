# Microservice Authentication with OAuth2 and PKCE

A secure authentication setup for a microservices architecture implementing the **OAuth2 Authorization Code Flow with PKCE**. This project demonstrates how to integrate a **public frontend client** with a **Keycloak authorization server**, a **Spring Cloud Gateway**, and **resource servers** that validate issued access tokens.

---

## 🧱 Architecture Overview

- **Frontend (Next.js)**  
  Acts as a **public client** using **PKCE** to securely authenticate users via the browser.

- **Keycloak (Authorization Server)**  
  Runs in a Docker container. Handles login, token issuance, and identity management.

- **Spring Cloud Gateway**  
  Serves as the entry point to the backend and enforces token validation via introspection or signature verification.

- **Resource Server (Spring Boot)**  
  Protects business APIs and validates incoming access tokens via JWT.

---

## 🔐 OAuth2 Flow with PKCE

This project implements the **OAuth2 Authorization Code flow with Proof Key for Code Exchange (PKCE)**.

### Key Points:

- **No client secret** is stored on the frontend – ideal for public SPAs.
- **Redirect URI**, **Web origins**, and **CORS settings** must be properly configured in Keycloak.
- After login, the frontend receives the **authorization code**, which it exchanges for an **access token** and **refresh token**.

> 📌 Make sure the client in Keycloak has **PKCE enabled** and is set as a **Public Client**.
