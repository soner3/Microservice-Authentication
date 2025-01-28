"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Keycloak from "keycloak-js";

export const keycloak = new Keycloak({
  url: "http://localhost:9090",
  realm: process.env.NEXT_PUBLIC_AUTH_KEYCLOAK_REALM!,
  clientId: process.env.NEXT_PUBLIC_AUTH_KEYCLOAK_ID!,
});

async function initKeycloak() {
  try {
    const authenticated = await keycloak.init({
      onLoad: "login-required",
      pkceMethod: "S256",
      redirectUri: "http://localhost:8080",
    });

    if (authenticated) {
      console.log("User is authenticated");
      console.log("Access Token:", keycloak.token);
    } else {
      console.log("User is not authenticated");
      await keycloak.login();
    }
  } catch (error) {
    console.error("Failed to initialize Keycloak:", error);
  }
}

interface KeycloakContextProps {
  keycloakInitialized: boolean;
  keycloak: Keycloak;
}

const KeycloakContext = createContext<KeycloakContextProps>({
  keycloakInitialized: false,
  keycloak,
});

export const KeycloakProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [keycloakInitialized, setKeycloakInitialized] = useState(false);

  useEffect(() => {
    const initializeKeycloak = async () => {
      await initKeycloak();
      setKeycloakInitialized(true);
    };

    initializeKeycloak();
  }, []);

  return (
    <KeycloakContext.Provider value={{ keycloakInitialized, keycloak }}>
      {keycloakInitialized ? children : <div>Loading...</div>}
    </KeycloakContext.Provider>
  );
};

export const useKeycloak = () => useContext(KeycloakContext);
