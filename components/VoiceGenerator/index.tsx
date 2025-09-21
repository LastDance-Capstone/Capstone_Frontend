"use client";

import { useState, useRef } from "react";
import TextField from "@/components/TextField";
import Button from "@/components/Button";
import styles from "./voicegenerator.module.css";

export default function VoiceGenerator() {
  // 상태 관리
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [isTextModified, setIsTextModified] = useState(false);
  const [originalText, setOriginalText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 업로드 핸들러
  const HandleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setUploadedFile(file);
      setIsGenerated(false);
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
      setIsGenerated(false);
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
    
    setIsGenerating(true);
    try {
      // TODO: 서버 API 호출
      // const res = await generateVoice(uploadedFile, textValue);
      
      // 임시 로직
      setTimeout(() => {
        setIsGenerating(false);
        setIsGenerated(true);
        setIsTextModified(false);
        setOriginalText(textValue);
      }, 2000);
    } catch (error) {
      setIsGenerating(false);
      console.error('음성 생성 중 오류:', error);
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
            style={{ display: 'none' }}
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
              >
                재생
              </Button>
              <Button
                size="small"
                iconName="download"
              >
                저장
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}