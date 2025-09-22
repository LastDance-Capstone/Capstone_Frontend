"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import KakaoLogin from "@/utils/oauth/kakao";
import styles from "./header.module.css";

export default function Header({
  isLoggedIn
}: {
  isLoggedIn: boolean;
}) {
  return (
    <header className={styles.header}>
      <div className={styles.desktop}>
        <Link href="/" className={styles.logo}>
          <Logo
            type="text"
            size={187}
          />
        </Link>
        <div className={styles.buttons}>
          {isLoggedIn ? (
            <Button
              variant="linear"
              size="small"
              onClick={() => { window.location.href = "/oauth/logout"; }}
              iconName="log-out"
            >
              로그아웃
            </Button>
          ) : (
            <Button
              variant="linear"
              size="small"
              onClick={() => KakaoLogin()}
              iconName="log-in"
            >
              로그인
            </Button>
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
              onClick={() => { window.location.href = "/oauth/logout"; }}
              iconName="log-out"
              iconOnly
            />
          ) : (
            <Button
              variant="linear"
              size="tiny"
              onClick={() => KakaoLogin()}
              iconName="log-in"
              iconOnly
            />
          )}
        </div>
      </div>
    </header>
  )
}