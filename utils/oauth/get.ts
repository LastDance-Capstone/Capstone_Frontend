"use server";

import JWT from "@/types/token";

export default async function GetJWT(
  token: string
): Promise<
  JWT
> {
  const backendUrl = `${process.env.BACKEND_BASE_URL}/oauth/callback/kakao`;
  if (!process.env.BACKEND_BASE_URL) throw new Error("server_misconfigured");

  const res = await fetch(backendUrl, {
    method: "POST",
    headers: {
      "Authorization": token,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("internal_server_error");

  return res.json();
}