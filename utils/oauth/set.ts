"use server";

import SetCookie from "../cookie/set";
import JWT from "@/types/token";

export default async function SetJWT(
  tokens: JWT
) {
  await SetCookie("access_token", tokens.access_token, tokens.expires_in);
  await SetCookie("refresh_token", tokens.refresh_token, 7 * 24 * 60 * 60);

  // access_exp: 만료 시각 (epoch ms) - 디코딩 없이 만료 판단용. HttpOnly 아님 (단, 민감정보 아님)
  const nowSec = Math.floor(Date.now() / 1000);
  const expMs = (nowSec + tokens.expires_in) * 1000;
  await SetCookie("access_exp", String(expMs), tokens.expires_in);
}