import { SpeechSettings, SpeechRecognitionResult } from '../types';

// Speech Service class for handling text-to-speech and speech-to-text
export class SpeechService {
  private static instance: SpeechService;
  private speechSynthesis: SpeechSynthesis;
  private speechRecognition: any; // SpeechRecognition type varies by browser
  private isListening = false;
  private isPlaying = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private recognitionCallbacks: {
    onResult?: (result: SpeechRecognitionResult) => void;
    onError?: (error: string) => void;
    onEnd?: () => void;
  } = {};

  private constructor() {
    this.speechSynthesis = window.speechSynthesis;
    this.initializeSpeechRecognition();
  }

  public static getInstance(): SpeechService {
    if (!SpeechService.instance) {
      SpeechService.instance = new SpeechService();
    }
    return SpeechService.instance;
  }

  // Initialize speech recognition
  private initializeSpeechRecognition(): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.speechRecognition = new SpeechRecognition();
      this.setupRecognitionEvents();
    }
  }

  // Setup speech recognition event handlers
  private setupRecognitionEvents(): void {
    if (!this.speechRecognition) return;

    this.speechRecognition.continuous = true;
    this.speechRecognition.interimResults = true;
    this.speechRecognition.lang = 'en-US';

    this.speechRecognition.onstart = () => {
      this.isListening = true;
      console.log('Speech recognition started');
    };

    this.speechRecognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence;

        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          
          const result: SpeechRecognitionResult = {
            transcript: finalTranscript,
            confidence: confidence || 0.8,
            isFinal: true,
            timestamp: new Date()
          };

          this.recognitionCallbacks.onResult?.(result);
        } else {
          interimTranscript += transcript;
          
          const result: SpeechRecognitionResult = {
            transcript: interimTranscript,
            confidence: confidence || 0.5,
            isFinal: false,
            timestamp: new Date()
          };

          this.recognitionCallbacks.onResult?.(result);
        }
      }
    };

    this.speechRecognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      
      let errorMessage = 'Speech recognition error occurred';
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try speaking again.';
          break;
        case 'audio-capture':
          errorMessage = 'Audio capture failed. Please check your microphone.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please allow microphone permissions.';
          break;
        case 'network':
          errorMessage = 'Network error occurred during speech recognition.';
          break;
        case 'service-not-allowed':
          errorMessage = 'Speech recognition service not allowed.';
          break;
      }

      this.recognitionCallbacks.onError?.(errorMessage);
    };

    this.speechRecognition.onend = () => {
      this.isListening = false;
      console.log('Speech recognition ended');
      this.recognitionCallbacks.onEnd?.();
    };
  }

  // Start speech recognition
  public startListening(callbacks: {
    onResult?: (result: SpeechRecognitionResult) => void;
    onError?: (error: string) => void;
    onEnd?: () => void;
  } = {}): void {
    if (!this.speechRecognition) {
      callbacks.onError?.('Speech recognition not supported in this browser');
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.recognitionCallbacks = callbacks;

    try {
      this.speechRecognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      callbacks.onError?.('Failed to start speech recognition');
    }
  }

  // Stop speech recognition
  public stopListening(): void {
    if (this.speechRecognition && this.isListening) {
      this.speechRecognition.stop();
    }
  }

  // Speak text using text-to-speech
  public speak(
    text: string,
    options: {
      voice?: string;
      rate?: number;
      pitch?: number;
      volume?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (error: string) => void;
    } = {}
  ): void {
    if (this.isPlaying) {
      this.stopSpeaking();
    }

    this.currentUtterance = new SpeechSynthesisUtterance(text);
    
    // Set voice options
    this.currentUtterance.rate = options.rate || 1.0;
    this.currentUtterance.pitch = options.pitch || 1.0;
    this.currentUtterance.volume = options.volume || 1.0;

    // Set voice if specified
    if (options.voice) {
      const voices = this.getAvailableVoices();
      const selectedVoice = voices.find(voice => 
        voice.name === options.voice || voice.lang.includes(options.voice!)
      );
      if (selectedVoice) {
        this.currentUtterance.voice = selectedVoice;
      }
    }

    // Set event handlers
    this.currentUtterance.onstart = () => {
      this.isPlaying = true;
      options.onStart?.();
    };

    this.currentUtterance.onend = () => {
      this.isPlaying = false;
      this.currentUtterance = null;
      options.onEnd?.();
    };

    this.currentUtterance.onerror = (event) => {
      this.isPlaying = false;
      this.currentUtterance = null;
      console.error('Speech synthesis error:', event);
      options.onError?.('Text-to-speech error occurred');
    };

    // Speak the text
    this.speechSynthesis.speak(this.currentUtterance);
  }

  // Stop current speech
  public stopSpeaking(): void {
    if (this.isPlaying) {
      this.speechSynthesis.cancel();
      this.isPlaying = false;
      this.currentUtterance = null;
    }
  }

  // Pause current speech
  public pauseSpeaking(): void {
    if (this.isPlaying && !this.speechSynthesis.paused) {
      this.speechSynthesis.pause();
    }
  }

  // Resume paused speech
  public resumeSpeaking(): void {
    if (this.isPlaying && this.speechSynthesis.paused) {
      this.speechSynthesis.resume();
    }
  }

  // Get available voices
  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.speechSynthesis.getVoices();
  }

  // Get voices by language
  public getVoicesByLanguage(language: string): SpeechSynthesisVoice[] {
    return this.getAvailableVoices().filter(voice => 
      voice.lang.toLowerCase().includes(language.toLowerCase())
    );
  }

  // Get current status
  public getStatus(): {
    isListening: boolean;
    isPlaying: boolean;
    isPaused: boolean;
    supportsSpeechRecognition: boolean;
    supportsSpeechSynthesis: boolean;
  } {
    return {
      isListening: this.isListening,
      isPlaying: this.isPlaying,
      isPaused: this.speechSynthesis.paused,
      supportsSpeechRecognition: !!this.speechRecognition,
      supportsSpeechSynthesis: 'speechSynthesis' in window
    };
  }

  // Set speech recognition language
  public setRecognitionLanguage(language: string): void {
    if (this.speechRecognition) {
      this.speechRecognition.lang = language;
    }
  }

  // Set speech recognition settings
  public setRecognitionSettings(settings: {
    continuous?: boolean;
    interimResults?: boolean;
    maxAlternatives?: number;
  }): void {
    if (!this.speechRecognition) return;

    if (settings.continuous !== undefined) {
      this.speechRecognition.continuous = settings.continuous;
    }
    if (settings.interimResults !== undefined) {
      this.speechRecognition.interimResults = settings.interimResults;
    }
    if (settings.maxAlternatives !== undefined) {
      this.speechRecognition.maxAlternatives = settings.maxAlternatives;
    }
  }

  // Check browser support
  public static checkBrowserSupport(): {
    speechRecognition: boolean;
    speechSynthesis: boolean;
  } {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    return {
      speechRecognition: !!SpeechRecognition,
      speechSynthesis: 'speechSynthesis' in window
    };
  }

  // Test microphone access
  public async testMicrophoneAccess(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone access test failed:', error);
      return false;
    }
  }

  // Convert speech to text (one-time recognition)
  public async speechToText(options: {
    timeout?: number;
    language?: string;
  } = {}): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.speechRecognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      const timeout = options.timeout || 10000; // 10 seconds default
      const originalLang = this.speechRecognition.lang;
      
      if (options.language) {
        this.speechRecognition.lang = options.language;
      }

      // Set up one-time recognition
      this.speechRecognition.continuous = false;
      this.speechRecognition.interimResults = false;

      const timeoutId = setTimeout(() => {
        this.speechRecognition.stop();
        reject(new Error('Speech recognition timeout'));
      }, timeout);

      const onResult = (event: any) => {
        clearTimeout(timeoutId);
        const transcript = event.results[0][0].transcript;
        this.speechRecognition.lang = originalLang; // Restore original language
        resolve(transcript);
      };

      const onError = (event: any) => {
        clearTimeout(timeoutId);
        this.speechRecognition.lang = originalLang; // Restore original language
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      this.speechRecognition.onresult = onResult;
      this.speechRecognition.onerror = onError;

      try {
        this.speechRecognition.start();
      } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
      }
    });
  }

  // Text to speech with promise
  public async textToSpeech(
    text: string,
    options: {
      voice?: string;
      rate?: number;
      pitch?: number;
      volume?: number;
    } = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.speak(text, {
        ...options,
        onEnd: () => resolve(),
        onError: (error) => reject(new Error(error))
      });
    });
  }

  // Get speech settings from localStorage
  public getSpeechSettings(userId: string): SpeechSettings {
    const stored = localStorage.getItem(`speechSettings_${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }

    // Default settings
    return {
      recognition: {
        enabled: true,
        language: 'en-US',
        continuous: true,
        interimResults: true
      },
      synthesis: {
        enabled: true,
        voice: '',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0
      }
    };
  }

  // Save speech settings to localStorage
  public saveSpeechSettings(userId: string, settings: SpeechSettings): void {
    localStorage.setItem(`speechSettings_${userId}`, JSON.stringify(settings));
  }

  // Apply speech settings
  public applySpeechSettings(settings: SpeechSettings): void {
    // Apply recognition settings
    this.setRecognitionLanguage(settings.recognition.language);
    this.setRecognitionSettings({
      continuous: settings.recognition.continuous,
      interimResults: settings.recognition.interimResults
    });
  }

  // Get recommended voices for different languages
  public getRecommendedVoices(): { [language: string]: SpeechSynthesisVoice[] } {
    const voices = this.getAvailableVoices();
    const recommended: { [language: string]: SpeechSynthesisVoice[] } = {};

    const languages = ['en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', 'it-IT', 'pt-BR', 'ru-RU', 'ja-JP', 'ko-KR', 'zh-CN'];

    languages.forEach(lang => {
      recommended[lang] = voices.filter(voice => voice.lang === lang);
    });

    return recommended;
  }

  // Voice activity detection
  public async detectVoiceActivity(
    duration: number = 5000,
    threshold: number = 0.01
  ): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      microphone.connect(analyser);
      analyser.fftSize = 512;
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      let voiceDetected = false;
      const startTime = Date.now();
      
      const checkAudio = () => {
        analyser.getByteFrequencyData(dataArray);
        
        // Calculate average volume
        const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
        const normalizedVolume = average / 255;
        
        if (normalizedVolume > threshold) {
          voiceDetected = true;
        }
        
        if (Date.now() - startTime < duration && !voiceDetected) {
          requestAnimationFrame(checkAudio);
        } else {
          // Cleanup
          stream.getTracks().forEach(track => track.stop());
          audioContext.close();
        }
      };
      
      checkAudio();
      
      // Wait for the duration
      await new Promise(resolve => setTimeout(resolve, duration));
      
      return voiceDetected;
    } catch (error) {
      console.error('Voice activity detection failed:', error);
      return false;
    }
  }

  // Cleanup resources
  public cleanup(): void {
    this.stopListening();
    this.stopSpeaking();
    this.recognitionCallbacks = {};
  }
}

// Export singleton instance
export const speechService = SpeechService.getInstance();
