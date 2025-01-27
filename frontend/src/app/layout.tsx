import RefreshService from "@/components/RefreshService";
import AuthProvider from "./AuthProvider";
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
        <AuthProvider>
          <StoreProvider>
            <RefreshService />
            {children}
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
