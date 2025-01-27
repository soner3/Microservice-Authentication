import { auth } from "@/auth";
import { RefreshResponseDto } from "@/lib/refreshTokenObjects";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const refreshToken: string = await request.json();

  const refreshTokenDto = new URLSearchParams({
    client_id: process.env.AUTH_KEYCLOAK_ID!,
    refresh_token: refreshToken,
    client_secret: process.env.AUTH_KEYCLOAK_SECRET!,
    grant_type: process.env.GRANT_TYPE!,
  });

  try {
    const externalApiUrl = process.env.REFRESH_URL!;

    const externalResponse = await fetch(externalApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: refreshTokenDto.toString(),
    });

    if (!externalResponse.ok) {
      const errorText = await externalResponse.text();
      console.error("Error response from external API:", errorText);
      return NextResponse.json(
        { error: "Failed to refresh token", details: errorText },
        { status: externalResponse.status }
      );
    }

    const refreshResponseDto: RefreshResponseDto =
      await externalResponse.json();

    return NextResponse.json(refreshResponseDto);
  } catch (error) {
    console.error("Error sending data to external API:", error);
    return NextResponse.json(
      { error: "Failed to send data to external API", details: error },
      { status: 500 }
    );
  }
}
