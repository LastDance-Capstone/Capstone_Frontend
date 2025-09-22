import Header from "@/components/Header";
import GetCookie from "@/utils/cookie/get";
import VoiceGenerator from "@/components/VoiceGenerator";
import styles from "./page.module.css";

export default async function Home() {
  const isLoggedIn = await GetCookie("access_token") ? true : false;

  return (
    <main className={styles.page}>
      <Header
        isLoggedIn={isLoggedIn}
      />
      <div className={styles.main}>
        <div className={styles.message}>
          <h1 className={styles.title}>
            나를 지키는 가장 익숙한 목소리
          </h1>
          <div className={styles.description}>
            <p>
              &apos;누구세요?&apos;라고 직접 묻기 불안했던 배달원, 예상치 못한 방문 앞에서도 더는 마음 졸이지 마세요.
            </p>
            <p className={styles.description}>
              가장 익숙하고 믿음직한 목소리가 현관문 너머의 나를 안전하게 지켜주는 든든한 보안관이 되어줍니다.
            </p>
          </div>
          {!isLoggedIn ? (
              <p className={styles.please}>
                서비스를 이용하려면 먼저 로그인해 주세요.
              </p>
            ) : (
              <VoiceGenerator />
            )
          }
        </div>
      </div>
    </main>
  );
}
