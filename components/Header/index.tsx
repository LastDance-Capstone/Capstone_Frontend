import Link from "next/link";
import Button from "@/components/Button";
import styles from "./header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.desktop}>
        <Link href="/" className={styles.logo}>
          <h1>
            VoiceSecure
          </h1>
        </Link>
        <div className={styles.buttons}>
          <Link href="/login">
            <Button
              variant="linear"
              size="small"
              iconName="log-in"
            >
              로그인
            </Button>
          </Link>
        </div>
      </div>
      <div className={styles.mobile}>
        <h1>
          VoiceSecure
        </h1>
        <div className={styles.buttons}>
          <Link href="/login">
            <Button
              variant="linear"
              size="tiny"
              iconName="log-in"
              iconOnly
            />
          </Link>
        </div>
      </div>
    </header>
  )
}