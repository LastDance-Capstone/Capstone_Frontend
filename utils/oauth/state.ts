import SetCookie from "../cookie/set";

export default function GenState() {
  // CSRF 방지용 state
  if (typeof window === "undefined") return "";
  // Web Crypto API: 안전한 난수. 두 개의 32-bit 숫자를 결합해 충돌 가능성 낮춤
  const s = crypto.getRandomValues(new Uint32Array(2)).join("-");
  // 로그인 흐름 중복 탭 대비를 위해 세션 범위에 저장
  sessionStorage.setItem("oauth_state", s);
  // 서버에서 더블 서브밋 쿠키 방식으로 state 검증을 수행할 수 있도록 쿠키도 설정
  SetCookie("oauth_state", s, 600);

  return s;
}
