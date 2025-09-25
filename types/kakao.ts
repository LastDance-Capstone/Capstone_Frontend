export interface KakaoAuth {
  authorize(params: KakaoAuthorizeParams): void;
  cleanup(): void;
  getAccessToken(): String;
  getAppKey(): String;
  getStatusInfo(): Promise<Object|Object>;
  logout(): Promise<Object|Object>;
}

export interface KakaoSDK {
  init(key: string): void;
  isInitialized(): boolean;
  Auth: KakaoAuth;
}

declare global {
  interface Window {
    Kakao: KakaoSDK;
  }
}

export default interface KakaoAuthorizeParams {
  redirectUri: string;
  state?: string;
  scope?: string | string[];
  prompt?: string;
  nonce?: string;
  throughTalk?: boolean;
}