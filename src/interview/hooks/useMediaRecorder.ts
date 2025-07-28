import { useCallback, useEffect, useRef, useState } from 'react';

export type RecorderStatus = 'idle' | 'recording' | 'paused' | 'stopped' | 'error';

interface UseMediaRecorderOptions {
  mimeType?: string; // e.g. 'video/webm;codecs=vp9,opus'
  onDataAvailable?: (blob: Blob) => void; // fired periodically when data chunks are ready
  onStop?: (blob: Blob) => void; // fired when recording stops with the final blob
  timeslice?: number; // ms interval for onDataAvailable
}

export const useMediaRecorder = (
  stream: MediaStream | null,
  {
    mimeType = 'video/webm;codecs=vp8,opus',
    onDataAvailable,
    onStop,
    timeslice = 1000
  }: UseMediaRecorderOptions = {}
) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);

  // initialize whenever stream changes
  useEffect(() => {
    if (!stream) {
      mediaRecorderRef.current = null;
      return;
    }

    try {
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.onstart = () => {
        setStatus('recording');
      };

      recorder.onpause = () => setStatus('paused');
      recorder.onresume = () => setStatus('recording');

      recorder.onerror = (ev: Event) => {
        setStatus('error');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err = (ev as any).error as Error | undefined;
        setError(err ?? new Error('MediaRecorder error'));
      };

      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) {
          chunks.push(ev.data);
          onDataAvailable?.(ev.data);
        }
      };

      recorder.onstop = () => {
        const finalBlob = new Blob(chunks, { type: mimeType });
        setBlob(finalBlob);
        setStatus('stopped');
        onStop?.(finalBlob);
      };
    } catch (err) {
      setStatus('error');
      setError(err as Error);
    }
  }, [stream, mimeType, onDataAvailable, onStop]);

  const start = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
      mediaRecorderRef.current.start(timeslice);
    }
  }, [timeslice]);

  const pause = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
    }
  }, []);

  const stop = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  return {
    status,
    error,
    start,
    pause,
    resume,
    stop,
    blob
  } as const;
};
