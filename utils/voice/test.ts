"use server";

export default async function GetTestSentence(
  voiceFile: File
): Promise<
  File
> {
  const backendUrl = `${process.env.BACKEND_BASE_URL}/voice-test`;
  if (!process.env.BACKEND_BASE_URL) throw new Error("server_misconfigured");

  const formData = new FormData();
  formData.append("voice_file", voiceFile);

  const res = await fetch(backendUrl, {
    method: "POST",
    body: formData
  });
  const blob = await res.blob();
  if (!res.ok) throw new Error("internal_server_error");

  const file = new File([blob], "response.wav", { type: blob.type });

  return file;
}