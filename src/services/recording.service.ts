import { RecordingData, RecordingSettings } from '../types';

// Recording Service class for handling audio/video recording
export class RecordingService {
  private static instance: RecordingService;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private isRecording = false;
  private recordingType: 'audio' | 'video' | 'screen' = 'audio';
  private startTime: number = 0;

  private constructor() {}

  public static getInstance(): RecordingService {
    if (!RecordingService.instance) {
      RecordingService.instance = new RecordingService();
    }
    return RecordingService.instance;
  }

  // Start audio recording
  public async startAudioRecording(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      });

      this.recordingType = 'audio';
      await this.initializeRecorder();
      this.startRecording();
    } catch (error) {
      console.error('Error starting audio recording:', error);
      throw new Error('Failed to start audio recording. Please check microphone permissions.');
    }
  }

  // Start video recording
  public async startVideoRecording(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      this.recordingType = 'video';
      await this.initializeRecorder();
      this.startRecording();
    } catch (error) {
      console.error('Error starting video recording:', error);
      throw new Error('Failed to start video recording. Please check camera and microphone permissions.');
    }
  }

  // Start screen recording
  public async startScreenRecording(includeAudio: boolean = true): Promise<void> {
    try {
      // Get screen capture stream
      const screenStream = await (navigator.mediaDevices as any).getDisplayMedia({
        video: {
          cursor: 'always',
          displaySurface: 'monitor'
        },
        audio: includeAudio
      });

      // Optionally combine with microphone audio
      if (includeAudio) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            }
          });

          // Combine streams
          const combinedStream = new MediaStream([
            ...screenStream.getVideoTracks(),
            ...screenStream.getAudioTracks(),
            ...audioStream.getAudioTracks()
          ]);

          this.stream = combinedStream;
        } catch (audioError) {
          console.warn('Could not access microphone for screen recording:', audioError);
          this.stream = screenStream;
        }
      } else {
        this.stream = screenStream;
      }

      this.recordingType = 'screen';
      await this.initializeRecorder();
      this.startRecording();
    } catch (error) {
      console.error('Error starting screen recording:', error);
      throw new Error('Failed to start screen recording. Please check screen sharing permissions.');
    }
  }

  // Initialize media recorder
  private async initializeRecorder(): Promise<void> {
    if (!this.stream) {
      throw new Error('No media stream available');
    }

    // Determine MIME type based on browser support
    const mimeType = this.getSupportedMimeType();
    
    this.mediaRecorder = new MediaRecorder(this.stream, {
      mimeType,
      videoBitsPerSecond: this.recordingType === 'video' || this.recordingType === 'screen' ? 2500000 : undefined,
      audioBitsPerSecond: 128000
    });

    this.recordedChunks = [];

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      this.isRecording = false;
    };

    this.mediaRecorder.onerror = (event) => {
      console.error('MediaRecorder error:', event);
      this.stopRecording();
    };
  }

  // Start the actual recording
  private startRecording(): void {
    if (!this.mediaRecorder) {
      throw new Error('MediaRecorder not initialized');
    }

    this.startTime = Date.now();
    this.mediaRecorder.start(1000); // Collect data every second
    this.isRecording = true;
  }

  // Stop recording
  public async stopRecording(): Promise<RecordingData> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this.isRecording) {
        reject(new Error('No active recording to stop'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        try {
          const blob = new Blob(this.recordedChunks, {
            type: this.getSupportedMimeType()
          });

          const duration = Date.now() - this.startTime;
          const recordingData: RecordingData = {
            id: this.generateRecordingId(),
            sessionId: this.getCurrentSessionId(),
            type: this.recordingType,
            filename: this.generateFilename(),
            duration: Math.floor(duration / 1000), // Convert to seconds
            size: blob.size,
            format: this.getFileExtension(),
            createdAt: new Date(),
            blob,
            url: URL.createObjectURL(blob)
          };

          this.cleanup();
          resolve(recordingData);
        } catch (error) {
          reject(error);
        }
      };

      this.mediaRecorder.stop();
    });
  }

  // Pause recording
  public pauseRecording(): void {
    if (this.mediaRecorder && this.isRecording && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
    }
  }

  // Resume recording
  public resumeRecording(): void {
    if (this.mediaRecorder && this.isRecording && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
    }
  }

  // Check if currently recording
  public getRecordingStatus(): {
    isRecording: boolean;
    type: 'audio' | 'video' | 'screen' | null;
    duration: number;
    state: string | null;
  } {
    return {
      isRecording: this.isRecording,
      type: this.isRecording ? this.recordingType : null,
      duration: this.isRecording ? Math.floor((Date.now() - this.startTime) / 1000) : 0,
      state: this.mediaRecorder?.state || null
    };
  }

  // Download recording
  public downloadRecording(recordingData: RecordingData): void {
    if (!recordingData.url && recordingData.blob) {
      recordingData.url = URL.createObjectURL(recordingData.blob);
    }

    if (recordingData.url) {
      const link = document.createElement('a');
      link.href = recordingData.url;
      link.download = recordingData.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // Get supported MIME type
  private getSupportedMimeType(): string {
    const types = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4',
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/mpeg'
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return 'video/webm'; // Fallback
  }

  // Get file extension based on MIME type
  private getFileExtension(): string {
    const mimeType = this.getSupportedMimeType();
    
    if (mimeType.includes('webm')) return 'webm';
    if (mimeType.includes('mp4')) return 'mp4';
    if (mimeType.includes('mpeg')) return 'mp3';
    
    return this.recordingType === 'audio' ? 'webm' : 'webm';
  }

  // Generate recording ID
  private generateRecordingId(): string {
    return `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate filename
  private generateFilename(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const extension = this.getFileExtension();
    return `${this.recordingType}_recording_${timestamp}.${extension}`;
  }

  // Get current session ID (from localStorage or generate)
  private getCurrentSessionId(): string {
    return localStorage.getItem('currentSessionId') || 'session_' + Date.now();
  }

  // Cleanup resources
  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.isRecording = false;
  }

  // Check browser support
  public static checkBrowserSupport(): {
    mediaRecorder: boolean;
    getUserMedia: boolean;
    getDisplayMedia: boolean;
  } {
    return {
      mediaRecorder: typeof MediaRecorder !== 'undefined',
      getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      getDisplayMedia: !!(navigator.mediaDevices && (navigator.mediaDevices as any).getDisplayMedia)
    };
  }

  // Get available devices
  public async getAvailableDevices(): Promise<{
    audioInputs: MediaDeviceInfo[];
    videoInputs: MediaDeviceInfo[];
    audioOutputs: MediaDeviceInfo[];
  }> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      return {
        audioInputs: devices.filter(device => device.kind === 'audioinput'),
        videoInputs: devices.filter(device => device.kind === 'videoinput'),
        audioOutputs: devices.filter(device => device.kind === 'audiooutput')
      };
    } catch (error) {
      console.error('Error getting available devices:', error);
      return {
        audioInputs: [],
        videoInputs: [],
        audioOutputs: []
      };
    }
  }

  // Test device access
  public async testDeviceAccess(type: 'audio' | 'video'): Promise<boolean> {
    try {
      const constraints = type === 'audio' 
        ? { audio: true }
        : { video: true, audio: true };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error(`Error testing ${type} device access:`, error);
      return false;
    }
  }

  // Save recording to localStorage (for demo purposes)
  public saveRecordingToStorage(recordingData: RecordingData): void {
    try {
      // Convert blob to base64 for storage (not recommended for large files)
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result as string;
        const storageData = {
          ...recordingData,
          blob: undefined, // Remove blob from storage
          base64Data: base64Data.split(',')[1] // Remove data URL prefix
        };
        
        localStorage.setItem(`recording_${recordingData.id}`, JSON.stringify(storageData));
      };
      reader.readAsDataURL(recordingData.blob!);
    } catch (error) {
      console.error('Error saving recording to storage:', error);
    }
  }

  // Load recording from localStorage
  public loadRecordingFromStorage(recordingId: string): RecordingData | null {
    try {
      const stored = localStorage.getItem(`recording_${recordingId}`);
      if (!stored) return null;

      const data = JSON.parse(stored);
      
      // Convert base64 back to blob if needed
      if (data.base64Data) {
        const byteCharacters = atob(data.base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        data.blob = new Blob([byteArray], { type: this.getSupportedMimeType() });
        data.url = URL.createObjectURL(data.blob);
      }

      return data;
    } catch (error) {
      console.error('Error loading recording from storage:', error);
      return null;
    }
  }

  // Get all recordings from localStorage
  public getAllRecordings(): RecordingData[] {
    const recordings: RecordingData[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('recording_')) {
        const recordingId = key.replace('recording_', '');
        const recording = this.loadRecordingFromStorage(recordingId);
        if (recording) {
          recordings.push(recording);
        }
      }
    }

    return recordings.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // Delete recording
  public deleteRecording(recordingId: string): void {
    localStorage.removeItem(`recording_${recordingId}`);
  }

  // Clear all recordings
  public clearAllRecordings(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('recording_')) {
        localStorage.removeItem(key);
      }
    });
  }

  // Get recording statistics
  public getRecordingStats(): {
    totalRecordings: number;
    totalSize: number;
    totalDuration: number;
    byType: Record<string, number>;
  } {
    const recordings = this.getAllRecordings();
    
    const stats = {
      totalRecordings: recordings.length,
      totalSize: recordings.reduce((sum, rec) => sum + rec.size, 0),
      totalDuration: recordings.reduce((sum, rec) => sum + rec.duration, 0),
      byType: {} as Record<string, number>
    };

    recordings.forEach(rec => {
      stats.byType[rec.type] = (stats.byType[rec.type] || 0) + 1;
    });

    return stats;
  }
}

// Export singleton instance
export const recordingService = RecordingService.getInstance();
