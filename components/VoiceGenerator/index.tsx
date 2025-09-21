"use client";

import { useState, useRef, useEffect } from "react";
import TextField from "@/components/TextField";
import Button from "@/components/Button";
import GetCustomSentence from "@/utils/voice/custom";
import styles from "./voicegenerator.module.css";

export default function VoiceGenerator() {
  // 상태 관리
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [isTextModified, setIsTextModified] = useState(false);
  const [originalText, setOriginalText] = useState("");
  const [generatedAudio, setGeneratedAudio] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 컴포넌트 언마운트 시 메모리 정리
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl]);

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
      
      // 기존 생성된 오디오 정리
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl("");
      }
      setGeneratedAudio(null);
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
    
    setIsGenerating(true);
    try {
      // 기존 오디오 URL 정리
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl("");
      }
      
      // 커스텀 문장 API 호출
      const generatedFile = await GetCustomSentence(textValue, uploadedFile);
      setGeneratedAudio(generatedFile);
      
      // 재생을 위한 URL 생성
      const newAudioUrl = URL.createObjectURL(generatedFile);
      setAudioUrl(newAudioUrl);
      
      setIsGenerated(true);
      setIsTextModified(false);
      setOriginalText(textValue);
    } catch (error) {
      console.error('음성 생성 중 오류:', error);
      alert('음성 생성에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  // 오디오 재생 핸들러
  const HandlePlay = () => {
    if (!audioUrl) return;
    
    try {
      // 기존 오디오가 재생 중이면 정지
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      // 새 오디오 객체 생성 및 재생
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onloadstart = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        alert('오디오 재생에 실패했습니다.');
      };
      
      audio.play().catch(error => {
        console.error('오디오 재생 오류:', error);
        setIsPlaying(false);
        alert('오디오 재생에 실패했습니다.');
      });
    } catch (error) {
      console.error('오디오 재생 오류:', error);
      setIsPlaying(false);
    }
  };

  // 오디오 저장 핸들러
  const HandleDownload = () => {
    if (!generatedAudio) return;
    
    try {
      const url = URL.createObjectURL(generatedAudio);
      const a = document.createElement('a');
      a.href = url;
      a.download = generatedAudio.name || 'generated-voice.wav';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('파일 다운로드 오류:', error);
      alert('파일 다운로드에 실패했습니다.');
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
    </div>
  );
}