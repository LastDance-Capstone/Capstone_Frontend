import { useState, useEffect, useCallback } from "react";
import CategoryState from "@/types/state";
import CategoryVoice from "@/types/voice";
import GetCategorySentence from "@/utils/voice/category";

// 카테고리 배열
export const categories: string[] = ["배달", "스토킹", "모르는사람"];

export const useCategoryStates = () => {
  const [categoryStates, setCategoryStates] = useState<Record<string, CategoryState>>(() => {
    const initialStates: Record<string, CategoryState> = {} as Record<string, CategoryState>;
    categories.forEach(category => {
      initialStates[category] = { isGenerating: false, voices: [], isGenerated: false };
    });
    return initialStates;
  });

  // 카테고리별 음성 생성
  const generateCategoryVoices = useCallback(async (category: string, voiceFile: File) => {
    setCategoryStates(prev => ({
      ...prev,
      [category]: { ...prev[category], isGenerating: true }
    }));

    try {
      const generatedFiles = await GetCategorySentence(category, voiceFile);
      
      const voices: CategoryVoice[] = generatedFiles.map(file => ({
        file,
        url: URL.createObjectURL(file),
        isPlaying: false
      }));

      setCategoryStates(prev => ({
        ...prev,
        [category]: {
          isGenerating: false,
          voices,
          isGenerated: true
        }
      }));
    } catch (error) {
      console.error(`${category} 음성 생성 중 오류:`, error);
      setCategoryStates(prev => ({
        ...prev,
        [category]: { ...prev[category], isGenerating: false }
      }));
      throw new Error(`${category} 음성 생성에 실패했습니다. 다시 시도해 주세요.`);
    }
  }, []);

  // 모든 음성을 정지 상태로 변경
  const stopAllVoices = useCallback(() => {
    setCategoryStates(prev => {
      const newStates = { ...prev };
      categories.forEach(category => {
        newStates[category] = {
          ...newStates[category],
          voices: newStates[category].voices.map(v => ({ ...v, isPlaying: false }))
        };
      });
      return newStates;
    });
  }, []);

  // 특정 카테고리의 특정 음성 재생 상태 변경
  const setVoicePlayingState = useCallback((category: string, voiceIndex: number, isPlaying: boolean) => {
    setCategoryStates(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        voices: prev[category].voices.map((v, i) => ({
          ...v,
          isPlaying: i === voiceIndex ? isPlaying : false
        }))
      }
    }));
  }, []);

  // 카테고리별 음성 URL 정리
  useEffect(() => {
    return () => {
      Object.values(categoryStates).forEach(state => {
        state.voices.forEach(voice => {
          if (voice.url) {
            URL.revokeObjectURL(voice.url);
          }
        });
      });
    };
  }, []);

  return {
    categoryStates,
    generateCategoryVoices,
    stopAllVoices,
    setVoicePlayingState
  };
};