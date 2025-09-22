import { useState, useEffect, useCallback } from "react";
import GetCustomSentence from "@/utils/voice/custom";

export const useVoiceGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");

  // 음성 생성 함수
  const generateVoice = useCallback(async (text: string, voiceFile: File) => {
    setIsGenerating(true);
    
    try {
      // 기존 오디오 URL 정리
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl("");
      }
      
      // 커스텀 문장 API 호출
      const generatedFile = await GetCustomSentence(text, voiceFile);
      setGeneratedAudio(generatedFile);
      
      // 재생을 위한 URL 생성
      const newAudioUrl = URL.createObjectURL(generatedFile);
      setAudioUrl(newAudioUrl);
      
      setIsGenerated(true);
      return generatedFile;
    } catch (error) {
      console.error("음성 생성 중 오류:", error);
      throw new Error("음성 생성에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsGenerating(false);
    }
  }, [audioUrl]);

  // 생성 상태 초기화
  const resetGeneration = useCallback(() => {
    setIsGenerated(false);
    setGeneratedAudio(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl("");
    }
  }, [audioUrl]);

  // 컴포넌트 언마운트 시 URL 정리
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return {
    isGenerating,
    isGenerated,
    generatedAudio,
    audioUrl,
    generateVoice,
    resetGeneration
  };
};