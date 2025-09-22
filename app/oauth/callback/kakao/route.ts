import { NextResponse, NextRequest } from "next/server";
import GetCookie from "@/utils/cookie/get";
import GetJWT from "@/utils/oauth/get";
import SaveJWT from "@/utils/oauth/save";
import HandleError from "@/utils/oauth/error";
import KakaoTokenResponse from "@/types/kakaores";

export async function GET(
  req: NextRequest
): Promise<
  NextResponse
> {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    // 인가 코드 및 state 파라미터 확인
    if (!code || !state) {
      return HandleError(new Error("login_failed"), req.url);
    }

    // CSRF 공격 방지를 위한 state 검증 (Double Submit Cookie)
    const savedState = await GetCookie("oauth_state");
    if (!savedState || savedState !== state) {
      return HandleError(new Error("unauthorized"), req.url);
    }

    // 카카오에 토큰 요청
    const kakaoToken = await GetKakaoToken(code);

    // 백엔드 서버에 토큰 전달 및 서비스 토큰 발급
    const backendToken = await GetJWT(kakaoToken.access_token);

    // 성공 처리: 토큰을 쿠키에 저장하고 리디렉션
    await SaveJWT(backendToken);
    return NextResponse.redirect(new URL("/", req.url));
  } catch (error) {
    new Error(`Kakao OAuth callback error: ${error}`);
    // 모든 과정에서 발생한 에러 처리
    return HandleError(error, req.url);
  }
}

async function GetKakaoToken(code: string): Promise<KakaoTokenResponse> {
  const clientId = process.env.KAKAO_REST_API_KEY;
  const clientSecret = process.env.KAKAO_CLIENT_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("server_misconfigured");
  }

  const tokenUrl = "https://kauth.kakao.com/oauth/token";
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    code,
  });

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("token_exchange_failed");
  }

  return response.json();
}

// 캐시 방지
export const dynamic = "force-dynamic";