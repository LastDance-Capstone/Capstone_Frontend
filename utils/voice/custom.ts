"use server";

export default async function GetCustomSentence(
  text: string,
  voiceFile: File
): Promise<
  File
> {
  const backendUrl = `${process.env.BACKEND_BASE_URL}/custom-sentence`;
  if (!process.env.BACKEND_BASE_URL) throw new Error("server_misconfigured");

  const formData = new FormData();
  formData.append("text", text);
  formData.append("voice_file", voiceFile);

  const res = await fetch(backendUrl, {
    method: "POST",
    body: formData
  });
  if (!res.ok) throw new Error("internal_server_error");

  const blob = await res.blob();
  const file = new File([blob], "response.wav", { type: blob.type });

  return file;
}