import { NextResponse, NextRequest } from "next/server";
import DoReissue from "@/utils/oauth/reissue";
import SetJWT from "@/utils/oauth/set";

export async function GET(
  req: NextRequest
): Promise<
  NextResponse
> {
  try {
    const refreshToken = req.headers.get("Authorization");
    if (!refreshToken) {
      return NextResponse.json(
        { error: "no_refresh_token" },
        { status: 400 }
      );
    }

    const jwt = await DoReissue(refreshToken);

    await SetJWT(jwt);
    return NextResponse.json(
      jwt, { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 }
    );
  }
}