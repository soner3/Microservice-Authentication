import { KeycloakProvider } from "@/components/KeyCloakContext";
import "./globals.css";
import StoreProvider from "./StoreProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>
        <KeycloakProvider>
          <StoreProvider>{children}</StoreProvider>
        </KeycloakProvider>
      </body>
    </html>
  );
}
