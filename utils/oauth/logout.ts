"use server";

export default async function DoLogOut(
  token: string
): Promise<
  void
> {
  const backendUrl = `${process.env.BACKEND_BASE_URL}/users/logout`;
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