import { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface UseSpeechOptions {
  language?: string;
  continuous?: boolean;
  rate?: number;
}

export const useSpeech = (options: UseSpeechOptions = {}) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const startListening = () => {
    if (!browserSupportsSpeechRecognition) return;
    SpeechRecognition.startListening({
      continuous: options.continuous ?? false,
      language: options.language ?? 'en-US',
    });
  };

  const stopListening = () => {
    if (!browserSupportsSpeechRecognition) return;
    SpeechRecognition.stopListening();
  };

  const speak = (
    text: string,
    voice?: SpeechSynthesisVoice,
    rate: number = options.rate ?? 1,
  ): Promise<void> => {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      if (voice) utterance.voice = voice;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    });
  };

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    transcript,
    listening,
    startListening,
    stopListening,
    resetTranscript,
    speak,
    browserSupportsSpeechRecognition,
  };
};
