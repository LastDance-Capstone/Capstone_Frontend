export default function Play(
  url: string,
  callbacks?: {
    onLoadStart?: () => void;
    onEnded?: () => void;
    onError?: () => void;
  }
): HTMLAudioElement {
  const audio = new Audio(url);
  
  if (callbacks?.onLoadStart) {
    audio.onloadstart = callbacks.onLoadStart;
  }
  
  if (callbacks?.onEnded) {
    audio.onended = callbacks.onEnded;
  }
  
  if (callbacks?.onError) {
    audio.onerror = callbacks.onError;
  }
  
  audio.play().catch(error => {
    if (callbacks?.onError) {
      callbacks.onError();
    }
    throw new Error("오디오 재생에 실패했습니다.");
  });
  
  return audio;
};