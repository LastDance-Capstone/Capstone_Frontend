"use server";

import { cookies } from "next/headers";

export default async function SetCookie(
  key: string,
  value: string,
  maxAge: number
) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: key,
    value: value,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAge
  });
}