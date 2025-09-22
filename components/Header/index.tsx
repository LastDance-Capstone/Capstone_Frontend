"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
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
            size={196}
          />
        </Link>
        <div className={styles.buttons}>
          {isLoggedIn ? (
            <Link href="/oauth/logout">
              <Button
                variant="linear"
                size="small"
                iconName="log-out"
              >
                로그아웃
              </Button>
            </Link>
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
            <Link href="/oauth/logout">
              <Button
                variant="linear"
                size="tiny"
                iconName="log-out"
                iconOnly
              />
            </Link>
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
  )
}