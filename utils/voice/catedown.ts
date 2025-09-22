export default function DownloadCate(
  url: string,
  filename: string)
: void {
  try {
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  } catch (error) {
      console.error("파일 다운로드 오류:", error);
      throw new Error("파일 다운로드에 실패했습니다.");
  }
} 