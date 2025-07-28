import React, { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useMediaRecorder } from '../../interview/hooks/useMediaRecorder';
import JSZip from 'jszip';

interface InterviewRecorderProps {
  onRecordingComplete?: (blob: Blob) => void;
}

/**
 * InterviewRecorder handles webcam + microphone recording using MediaRecorder.
 * It previews the webcam feed, records on user command, and automatically
 * downloads the final recording (webm) when finished. It also exposes the
 * blob via callback so parent components can upload to Firebase Storage.
 */
export const InterviewRecorder: React.FC<InterviewRecorderProps> = ({ onRecordingComplete }) => {
  const webcamRef = useRef<Webcam>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // init media stream once component mounts
  useEffect(() => {
    const getStream = async () => {
      try {
        const media = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(media);
      } catch (err) {
        console.error('Unable to acquire media stream', err);
      }
    };
    getStream();
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { status, error: recorderError, start, stop, pause, resume, blob } = useMediaRecorder(stream);
  const isReady = !!stream && status === 'idle';

  // Auto-download when blob ready
  useEffect(() => {
    if (status === 'stopped' && blob) {
      onRecordingComplete?.(blob);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `interview-recording-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  }, [status, blob, onRecordingComplete]);

  const handleStart = useCallback(() => start(), [start]);
  const handleStop = useCallback(() => stop(), [stop]);
  const handlePause = useCallback(() => pause(), [pause]);
  const handleResume = useCallback(() => resume(), [resume]);

  return (
    <div className="space-y-4">
      <div className="w-full aspect-video bg-base-300 rounded-lg overflow-hidden">
        {stream ? (
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored
            videoConstraints={{ deviceId: undefined }}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">Camera permission required</div>
        )}
      </div>

      <div className="flex gap-2 justify-center">
        {status !== 'recording' && (
          <button className="btn btn-primary" onClick={handleStart} disabled={!isReady}>
            Start Recording
          </button>
        )}
        {status === 'recording' && (
          <>
            <button className="btn btn-warning" onClick={handlePause}>Pause</button>
            <button className="btn btn-error" onClick={handleStop}>Stop</button>
          </>
        )}
        {status === 'paused' && (
          <>
            <button className="btn btn-success" onClick={handleResume}>Resume</button>
            <button className="btn btn-error" onClick={handleStop}>Stop</button>
          </>
        )}
      </div>

      <div className="text-center text-sm text-base-content/60">Status: {status}</div>
      {recorderError && (
        <div className="text-error text-center text-sm mt-2">
          Recording error: {recorderError.message}
        </div>
      )}
    </div>
  );
};
