import { useRef, useEffect, useCallback } from "react";
import Play from "@/utils/voice/play";

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 오디오 정지 함수
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, []);

  // 오디오 재생 함수
  const playAudioFile = useCallback((
    url: string,
    callbacks?: {
      onLoadStart?: () => void;
      onEnded?: () => void;
      onError?: () => void;
    }
  ) => {
    try {
      // 기존 오디오 정지
      stopAudio();

      // 새 오디오 재생
      const audio = Play(url, callbacks);
      audioRef.current = audio;
    } catch (error) {
      console.error("오디오 재생 오류:", error);
      if (callbacks?.onError) {
        callbacks.onError();
      }
    }
  }, [stopAudio]);

  // 컴포넌트 언마운트 시 오디오 정리
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  return {
    playAudioFile,
    stopAudio
  };
};