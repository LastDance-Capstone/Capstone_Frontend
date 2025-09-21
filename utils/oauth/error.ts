import { NextResponse } from "next/server";
import DeleteCookie from "../cookie/delete";

export default function HandleError(
  error: any,
  requestUrl: string
): NextResponse {
  const url = new URL(requestUrl);
  const raw = error instanceof Error ? error.message : String(error);

  // 클라이언트에 노출할 수 있는 특정 에러 코드인 경우
  const known = ["token_exchange_failed", "unauthorized", "login_failed", "server_misconfigured"];
  const code = known.includes(raw) ? raw : "login_failed";

  const redirectUrl = new URL("/", url.origin);
  redirectUrl.searchParams.set("error", code);

  const response = NextResponse.redirect(redirectUrl, 302);
  // CSRF state 쿠키 정리
  DeleteCookie("oauth_state");
  return response;
}