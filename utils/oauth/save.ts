import DeleteCookie from "../cookie/delete";
import SetJWT from "./set";
import JWT from "@/types/token";

export default async function SaveJWT(
  tokens: JWT
) {
  // CSRF state 쿠키 정리
  DeleteCookie("oauth_state");

  // 공통 토큰 쿠키 설정 함수 사용
  await SetJWT(tokens);

  // redirect_after_login 쿠키 제거
  DeleteCookie("redirect_after_login");
}