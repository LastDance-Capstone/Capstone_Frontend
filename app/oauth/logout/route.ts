import { NextResponse, NextRequest } from "next/server";
import DoLogOut from "@/utils/oauth/logout";

export async function GET(
  req: NextRequest
): Promise<
  NextResponse
> {
  // 토큰 확인
  const token = req.cookies.get("refresh_token")?.value;
  
  // 백엔드에 로그아웃 요청 (토큰이 있을 때만)
  if (token) {
    await DoLogOut(token);
  }
  
  // 모든 쿠키 삭제
  const res = NextResponse.redirect(new URL("/", req.url));
  for (const cookie of req.cookies.getAll()) {
    res.cookies.delete(cookie.name);
  }
  
  return res;
}