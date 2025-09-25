"use server";

import { cookies } from "next/headers";

export default async function GetCookie(
  key: string
) {
  const cookieStore = await cookies();
  return cookieStore.get(key)?.value;
}