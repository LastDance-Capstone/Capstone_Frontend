"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useVoiceGeneration } from "@/hooks/useVoiceGeneration";
import { useCategoryStates, categories } from "@/hooks/useCategoryStates";
import DownloadCustom from "@/utils/voice/custdown";
import DownloadCate from "@/utils/voice/catedown";
import Button from "@/components/Button";
import TextField from "@/components/TextField";
import CategoryVoice from "@/types/voice";
import styles from "./voicegenerator.module.css";

// 카테고리 이름과 이미지 파일명 매핑
const categoryImages: Record<string, string> = {
  "배달": "delivery",
  "스토킹": "stalking", 
  "모르는사람": "stranger"
};

// 카테고리별 문장 매핑
const categorySentences: Record<string, string[]> = {
  "배달": [
    "문 앞에 두고 가주세요. 감사합니다.",
    "경비실에 맡겨주세요. 감사합니다.",
    "고생 많으십니다. 감사합니다.",
    "잘못 오신 것 같아요.",
    "계속 문 앞에 계시면 경찰 부르겠습니다."
  ],
  "스토킹": [
    "여기 CCTV 있어서 다 기록 되고 있어요.",
    "경찰 부르겠습니다. 돌아가세요.",
    "더 이상 찾아오지 마세요.",
    "더 이상 할 이야기 없으니 그냥 가세요.",
    "그런 사람 없습니다."
  ],
  "모르는사람": [
    "바빠서 괜찮습니다. 그냥 가주세요.",
    "필요 없으니 그냥 가주세요.",
    "잘못 오신 것 같아요.",
    "더 이상 벨 누르지 마세요.",
    "계속 이러시면 경찰에 신고하겠습니다."
  ]
};

export default function VoiceGenerator() {
  // 기본 상태
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [textValue, setTextValue] = useState("");
  const [isTextModified, setIsTextModified] = useState(false);
  const [originalText, setOriginalText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 커스텀 훅들
  const { playAudioFile } = useAudioPlayer();
  const { isGenerating, isGenerated, generatedAudio, audioUrl, generateVoice, resetGeneration } = useVoiceGeneration();
  const { categoryStates, generateCategoryVoices, stopAllVoices, setVoicePlayingState } = useCategoryStates();

  // 파일 업로드 핸들러
  const HandleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      setUploadedFile(file);
      resetGeneration();
      setIsTextModified(false);
    }
  };

  // 업로드 버튼 클릭 핸들러
  const HandleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // 텍스트 변경 핸들러
  const HandleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setTextValue(newValue);
    
    if (originalText && newValue !== originalText) {
      setIsTextModified(true);
      resetGeneration();
      setIsPlaying(false);
    }
  };

  // 텍스트 포커스 해제 핸들러
  const HandleTextBlur = () => {
    if (textValue && !originalText) {
      setOriginalText(textValue);
    }
  };

  // 음성 생성 핸들러
  const HandleGenerate = async () => {
    if (!uploadedFile || !textValue) return;
    
    try {
      await generateVoice(textValue, uploadedFile);
      setIsTextModified(false);
      setOriginalText(textValue);
    } catch (error) {
      alert(error instanceof Error ? error.message : "음성 생성에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  // 오디오 재생 핸들러
  const HandlePlay = () => {
    if (!audioUrl) return;
    
    try {
      playAudioFile(audioUrl, {
        onLoadStart: () => setIsPlaying(true),
        onEnded: () => setIsPlaying(false),
        onError: () => {
          setIsPlaying(false);
          alert("오디오 재생에 실패했습니다.");
        }
      });
    } catch (error) {
      console.error("오디오 재생 오류:", error);
      setIsPlaying(false);
    }
  };

  // 오디오 저장 핸들러
  const HandleDownload = () => {
    if (!generatedAudio) return;
    
    try {
      DownloadCustom(generatedAudio, generatedAudio.name || "generated-voice.wav");
    } catch (error) {
      alert(error instanceof Error ? error.message : "파일 다운로드에 실패했습니다.");
    }
  };

  // 카테고리별 음성 생성 핸들러
  const HandleCategoryGenerate = async (category: string) => {
    if (!uploadedFile) return;

    try {
      await generateCategoryVoices(category, uploadedFile);
    } catch (error) {
      alert(error instanceof Error ? error.message : `${category} 음성 생성에 실패했습니다.`);
    }
  };

  // 카테고리별 음성 재생 핸들러
  const HandleCategoryPlay = (category: string, voiceIndex: number) => {
    const voice = categoryStates[category].voices[voiceIndex];
    if (!voice) return;

    try {
      // 모든 음성 정지
      stopAllVoices();

      // 현재 음성 재생
      playAudioFile(voice.url, {
        onLoadStart: () => setVoicePlayingState(category, voiceIndex, true),
        onEnded: () => setVoicePlayingState(category, voiceIndex, false),
        onError: () => {
          setVoicePlayingState(category, voiceIndex, false);
          alert("오디오 재생에 실패했습니다.");
        }
      });
    } catch (error) {
      console.error("오디오 재생 오류:", error);
    }
  };

  // 카테고리별 음성 저장 핸들러
  const HandleCategoryDownload = (category: string, voiceIndex: number) => {
    const voice = categoryStates[category].voices[voiceIndex];
    if (!voice) return;

    try {
      const filename = voice.file.name || `${category}-voice-${voiceIndex + 1}.wav`;
      DownloadCate(voice.url, filename);
    } catch (error) {
      alert(error instanceof Error ? error.message : "파일 다운로드에 실패했습니다.");
    }
  };

  return (
    <div className={styles.content}>
      <TextField
        placeholder="발화문을 입력하시면, 업로드된 음성으로 발화문을 읽어주는 음성을 저장하거나 재생 할 수 있습니다."
        helperText="서비스 이용을 위해 반드시 음성 파일을 업로드해 주세요."
        className={styles.input}
        value={textValue}
        onChange={HandleTextChange}
        onBlur={HandleTextBlur}
      />
      <div className={styles.buttons}>
        <div className={styles.upload}>
          <input
            type="file"
            accept="audio/*"
            onChange={HandleFileUpload}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <Button
            size="small"
            variant="linear"
            iconName="cloud-upload"
            onClick={HandleUploadClick}
          >
            음성 업로드
          </Button>
          {uploadedFile && (
            <span className={styles.fileName}>
              {uploadedFile.name}
            </span>
          )}
        </div>
        <div className={styles.actions}>
          {/* 파일이 업로드되고 아직 생성되지 않았거나 텍스트가 수정된 경우 표시 */}
          {((uploadedFile && !isGenerated) || (isTextModified && uploadedFile)) && (
            <Button
              size="small"
              iconName="check"
              disabled={isGenerating || !textValue}
              onClick={HandleGenerate}
            >
              {isGenerating ? "생성 중..." : "생성"}
            </Button>
          )}
          {/* 음성이 생성되고 텍스트가 수정되지 않은 경우 */}
          {isGenerated && !isTextModified && (
            <>
              <Button
                size="small"
                iconName="play"
                disabled={isPlaying}
                onClick={HandlePlay}
              >
                {isPlaying ? "재생 중..." : "재생"}
              </Button>
              <Button
                size="small"
                iconName="download"
                onClick={HandleDownload}
              >
                저장
              </Button>
            </>
          )}
        </div>
      </div>
      {/* 음성이 업로드 되었을 때 카테고리 표시 */}
      {uploadedFile && (
        <div className={styles.categories}>
          {categories.map((category: string) => {
            const state = categoryStates[category];
            return (
              <div key={category} className={styles.cateItem}>
                <div className={styles.title}>
                  <h3>{category}</h3>
                  <Image
                    src={`/images/${categoryImages[category]}.png`}
                    alt={`${category} 아이콘`}
                    width={35}
                    height={35}
                  />
                </div>
                <div className={styles.voices}>
                  {!state.isGenerated && !state.isGenerating && (
                    <div className={styles.generating}>
                      <p className={styles.description}>
                        {category} 상황에 관련된 문장을 선택하여 사용해보세요!
                      </p>
                      <Button
                        size="small"
                        iconName="check"
                        onClick={() => HandleCategoryGenerate(category)}
                      >
                        생성
                      </Button>
                    </div>
                  )}
                  
                  {state.isGenerating && (
                    <div className={styles.generating}>
                      <p>음성 생성 중...</p>
                    </div>
                  )}
                  
                  {state.isGenerated && state.voices.length > 0 && (
                    <div className={styles.list}>
                      {state.voices.map((voice: CategoryVoice, index: number) => (
                        <div key={index} className={styles.voice}>
                          <span className={styles.text}>
                            {categorySentences[category][index]}
                          </span>
                          <div className={styles.actions}>
                            <Button
                              size="tiny"
                              iconName="play"
                              disabled={voice.isPlaying}
                              onClick={() => HandleCategoryPlay(category, index)}
                              iconOnly
                            />
                            <Button
                              size="tiny"
                              iconName="download"
                              onClick={() => HandleCategoryDownload(category, index)}
                              iconOnly
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}