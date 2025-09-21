import { NextResponse, NextRequest } from "next/server";
import JWT from "./types/token";

// 정적 리소스와 Next 내부 경로는 제외하고 나머지 경로에 미들웨어 적용
export const config = {
  matcher: [
    "/((?!_next/|favicon.ico|robots.txt|sitemap.xml|campus_main\\.).*)",
  ],
};

function IsHtmlNavigation(
  req: NextRequest
) {
  // 브라우저 탐색(문서 요청)인지 식별: Accept 헤더에 text/html 포함 여부로 판단
  const accept = req.headers.get("accept") || "";
  return accept.includes("text/html");
}

// 미들웨어 쿠키 조회 함수
function GetCookie(
  req: NextRequest,
  key: string
) {
  return req.cookies.get(key)?.value;
}

// 미들웨어 쿠키 설정 함수
function SetCookie(
  res: NextResponse,
  key: string,
  value: string,
  protocol: string,
  maxAge?: number
) {
  res.cookies.set(key, value, {
    httpOnly: true,
    secure: protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: maxAge
  });
}

// 모든 쿠키를 일괄 삭제 (예외 지정 가능)
function ClearAllCookies(
  res: NextResponse,
  req: NextRequest,
  except: string[] = []
) {
  const all = req.cookies.getAll();
  for (const c of all) {
    if (!except.includes(c.name)) {
      res.cookies.delete(c.name);
    }
  }
}

// 미들웨어 JWT 쿠키 저장 함수
function SaveJWT(
  res: NextResponse,
  protocol: string,
  tokens: JWT
) {
  SetCookie(
    res,
    "access_token",
    tokens.access_token,
    protocol,
    tokens.expires_in
  );
  SetCookie(
    res,
    "refresh_token",
    tokens.refresh_token,
    protocol,
    7 * 24 * 60 * 60
  );

  // access_exp: 만료 시각 (epoch ms) - 디코딩 없이 만료 판단용. HttpOnly 아님 (단, 민감정보 아님)
  const nowSec = Math.floor(Date.now() / 1000);
  const expMs = (nowSec + tokens.expires_in) * 1000;
  SetCookie(
    res,
    "access_exp",
    String(expMs),
    protocol,
    tokens.expires_in
  )
}

export default async function middleware(req: NextRequest) {
  const { origin, protocol } = req.nextUrl;

  // JWT 확인
  const accessToken = GetCookie(req, "access_token");
  const refreshToken = GetCookie(req, "refresh_token");

  // JWT 만료되면 재발급 시작
  if (!accessToken && refreshToken) {
    const reissueRes = await fetch(`${origin}/oauth/reissue`, {
      headers: { "Authorization": refreshToken! },
      cache: "no-store"
    });

    // JWT 재발급 성공하면 통과
    if (reissueRes.status === 200) {
      const jwt = await reissueRes.json();

      const res = NextResponse.next()
      SaveJWT(res, protocol, jwt);
      return res;
    }

    // JWT 재발급 실패하면 모든 쿠키 삭제하고 로그인으로 리다이렉트
    if (IsHtmlNavigation(req)) {
      const res = NextResponse.redirect(new URL("/", req.url));
      ClearAllCookies(res, req);
      return res;
    }

    // 브라우저 접근이 아니면 json으로 응답
    const res = NextResponse.json({ error: "unauthorized" }, { status: 401 });
    ClearAllCookies(res, req);
    return res;
  }
}