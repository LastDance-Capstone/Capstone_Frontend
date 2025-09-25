"use server";

import AdmZip from "adm-zip";

export default async function GetCategorySentence(
  category: string,
  voiceFile: File
): Promise<
  File[]
> {
  const backendUrl = `${process.env.BACKEND_BASE_URL}/category-sentences`;
  if (!process.env.BACKEND_BASE_URL) throw new Error("server_misconfigured");

  const formData = new FormData();
  formData.append("category", category);
  formData.append("voice_file", voiceFile);

  const res = await fetch(backendUrl, {
    method: "POST",
    body: formData
  });
  if (!res.ok) throw new Error("internal_server_error");

  // ZIP 파일을 ArrayBuffer로 받기
  const zipBuffer = await res.arrayBuffer();
  
  // ZIP 압축 해제
  const zip = new AdmZip(Buffer.from(zipBuffer));
  const zipEntries = zip.getEntries();
  
  // WAV 파일만 추출
  const audioFiles: File[] = [];
  zipEntries.forEach((entry) => {
    if (!entry.isDirectory && entry.entryName.toLowerCase().endsWith(".wav")) {
      const fileData = entry.getData();
      const uint8Array = new Uint8Array(fileData);
      const file = new File([uint8Array], entry.entryName, { type: "audio/wav" });
      audioFiles.push(file);
    }
  });
  
  // 정확히 5개의 WAV 파일이 있는지 확인
  if (audioFiles.length !== 5) {
    throw new Error(`Expected 5 WAV files, but found ${audioFiles.length}`);
  }
  
  return audioFiles;
}