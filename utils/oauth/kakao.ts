import GenState from "./state";
import KakaoAuthorizeParams from "@/types/kakao";

export async function WaitForKakaoReady(
  timeoutMs = 5000
): Promise<
  void
> {
  const start = Date.now();

  // 스크립트가 window에 올라올 때까지 대기
  while (typeof window === "undefined" || !("Kakao" in window)) {
    if (Date.now() - start > timeoutMs) {
      throw new Error("Kakao SDK load timed out");
    }
    await new Promise((r) => setTimeout(r, 50));
  }

  const K = window.Kakao!;
  // init되지 않았으면 여기서 초기화
  if (!K.isInitialized()) {
    const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (!key) throw new Error("Missing NEXT_PUBLIC_KAKAO_JS_KEY");
    K.init(key);
  }
}

export async function KakaoAuthorize(
  params: KakaoAuthorizeParams
) {
  await WaitForKakaoReady();
  const K = window.Kakao!;
  const state = params.state ?? GenState();

  K.Auth.authorize({
    redirectUri: params.redirectUri,
    state
  });
}

export default async function KakaoLogin(
  nextUrl?: string
) {
  try {
    await KakaoAuthorize({
      redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!,
      nonce: nextUrl
    });
  } catch (error) {
    console.error("Kakao login failed:", error);
  }
}