declare module 'react-speech-recognition' {
  import { ComponentType } from 'react';

  export interface SpeechRecognitionOptions {
    continuous?: boolean;
    language?: string;
  }

  export interface SpeechRecognitionHook {
    transcript: string;
    listening: boolean;
    resetTranscript: () => void;
    browserSupportsSpeechRecognition: boolean;
  }

  /**
   * Starts speech recognition with the given options.
   */
  export function startListening(options?: SpeechRecognitionOptions): void;

  /**
   * Stops speech recognition.
   */
  export function stopListening(): void;

  /**
   * React hook to access recognition state.
   */
  export function useSpeechRecognition(): SpeechRecognitionHook;

  /**
   * Higher-order component to inject recognition props (rarely used).
   */
  export function SpeechRecognitionHOC<P>(component: ComponentType<P>): ComponentType<P>;

  const SpeechRecognition: {
    startListening: typeof startListening;
    stopListening: typeof stopListening;
  };

  export default SpeechRecognition;
}
