"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import TextField from "@/components/TextField";
import Button from "@/components/Button";
import KakaoLogin from "@/utils/oauth/kakao";
import styles from "./page.module.css";

function KakaoLoginButton() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  return (
    <Button
      onClick={() => KakaoLogin(next!)}
      className={`${styles.button} ${styles.kakao}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
        <path d="M10.3077 2.91663C6.44359 2.91663 3 5.541 3 8.7792C3 10.7923 4.33205 12.5679 6.36026 13.6235L5.50684 16.6989C5.4312 16.9712 5.74658 17.1877 5.98846 17.0299L9.72949 14.5944C10.0449 14.6242 10.3658 14.6418 10.3077 14.6418C14.9406 14.6418 18 12.0166 18 8.7792C18 5.541 14.9406 2.91663 10.3077 2.91663Z" fill="#111111"/>
      </svg>
    </Button>
  );
}

export default function Login() {
  return (
    <main className={styles.page}>
      <div className={styles.aside}>
        <Logo
          type="text"
          size={204}
        />
      </div>
      <div className={styles.main}>
        <h1 className={styles.title}>
          로그인
        </h1>
        <div className={styles.content}>
          <TextField
            type="email"
            label="이메일"
            placeholder="voicehomesecure@example.com"
            className={styles.input}
          />
          <TextField
            type="password"
            label="비밀번호"
            placeholder="********"
            className={styles.input}
          />
          <Button
            className={styles.button}
            onClick={() => {}}
          >
            로그인
          </Button>
          <div className={styles.options}>
            <Button
              size="tiny"
              variant="transparent"
              className={styles.option}
              onClick={() => {}}
            >
              회원가입
            </Button>
            <p>
              |
            </p>
            <Button
              size="tiny"
              variant="transparent"
              className={styles.option}
              onClick={() => {}}
            >
              비밀번호 찾기
            </Button>
          </div>
          <div className={styles.divider}>
            <span></span>
            <span>간편 로그인</span>
            <span></span>
          </div>
          <Suspense>
            <KakaoLoginButton />
          </Suspense>
        </div>
      </div>
    </main>
  );
}