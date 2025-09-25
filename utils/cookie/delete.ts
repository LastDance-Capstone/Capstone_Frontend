"use server";

import { cookies } from "next/headers";

export default async function DeleteCookie(
  key: string
) {
  const cookieStore = await cookies();
  cookieStore.delete(key);
}