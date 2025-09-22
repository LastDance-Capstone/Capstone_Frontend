"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import GetCookie from "@/utils/cookie/get";
import styles from "./header.module.css";

export default function Header({
  isLoggedIn: initialIsLoggedIn
}: {
  isLoggedIn: boolean;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);

  // 클라이언트 사이드에서 토큰 상태 재확인
  useEffect(() => {
    // 쿠키에서 토큰 값을 가져오는 함수
    const checkTokens = async () => {
      const accessToken = await GetCookie("access_token");
      const refreshToken = await GetCookie("refresh_token");
      
      // 토큰 상태에 따라 명시적으로 로그인 상태 설정
      const shouldBeLoggedIn = !!(accessToken && refreshToken);
      setIsLoggedIn(shouldBeLoggedIn);
    };

    checkTokens();
    
    // 쿠키 변경 감지를 위한 interval
    const interval = setInterval(checkTokens, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.desktop}>
        <Link href="/" className={styles.logo}>
          <Logo
            type="text"
            size={196}
          />
        </Link>
        <div className={styles.buttons}>
          {isLoggedIn ? (
            <Button
              variant="linear"
              size="small"
              iconName="log-out"
              onClick={() => { window.location.href = "/oauth/logout"; }}
            >
              로그아웃
            </Button>
          ) : (
            <Link href="/login">
              <Button
                variant="linear"
                size="small"
                iconName="log-in"
              >
                로그인
              </Button>
            </Link>
          )}
        </div>
      </div>
      <div className={styles.mobile}>
        <Link href="/" className={styles.logo}>
          <Logo
            size={28}
          />
        </Link>
        <div className={styles.buttons}>
          {isLoggedIn ? (
            <Button
              variant="linear"
              size="tiny"
              iconName="log-out"
              onClick={() => { window.location.href = "/oauth/logout"; }}
              iconOnly
            />
          ) : (
            <Link href="/login">
              <Button
                variant="linear"
                size="tiny"
                iconName="log-in"
                iconOnly
              />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}