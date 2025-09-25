"use server";

import JWT from "@/types/token";

export default async function DoReissue(
  refreshToken: string
): Promise<
  JWT
> {
  const backendUrl = `${process.env.BACKEND_BASE_URL}/token/reissue`;
  if (!process.env.BACKEND_BASE_URL) throw new Error("server_misconfigured");

  const res = await fetch(backendUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ "refreshToken": refreshToken }),
    cache: "no-store"
  });
  if (!res.ok) throw new Error("internal_server_error");

  return res.json();
}