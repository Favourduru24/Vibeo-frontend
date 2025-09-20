import { useState, useRef, useEffect, useCallback } from "react";
import {
  getMediaStreams,
  createAudioMixer,
  setupRecording,
  cleanupRecording,
  createRecordingBlob,
  calculateRecordingDuration,
} from "@/utils";

export const useScreenRecording = () => {
  const [state, setState] = useState({
    isRecording: false,
    recordedBlob: null,
    recordedVideoUrl: "",
    recordingDuration: 0,
  });

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    return () => {
      stopRecording();
      if (state.recordedVideoUrl) URL.revokeObjectURL(state.recordedVideoUrl);
      audioContextRef.current?.close().catch(console.error);
    };
  }, [state.recordedVideoUrl]);

  const handleRecordingStop = () => {
    const { blob, url } = createRecordingBlob(chunksRef.current);
    const duration = calculateRecordingDuration(startTimeRef.current);

    setState((prev) => ({
      ...prev,
      recordedBlob: blob,
      recordedVideoUrl: url,
      recordingDuration: duration,
      isRecording: false,
    }));
  };

  const startRecording = async (withMic = true) => {
    try {
      stopRecording();

      const { displayStream, micStream, hasDisplayAudio } =
        await getMediaStreams(withMic);
      const combinedStream = new MediaStream() 

      displayStream
        .getVideoTracks()
        .forEach((track) => combinedStream.addTrack(track));

      audioContextRef.current = new AudioContext();
      const audioDestination = createAudioMixer(
        audioContextRef.current,
        displayStream,
        micStream,
        hasDisplayAudio
      );

      audioDestination?.stream
        .getAudioTracks()
        .forEach((track) => combinedStream.addTrack(track));

      combinedStream._originalStreams = [
        displayStream,
        ...(micStream ? [micStream] : []),
      ];
      streamRef.current = combinedStream;

      mediaRecorderRef.current = setupRecording(combinedStream, {
        onDataAvailable: (e) => e.data.size && chunksRef.current.push(e.data),
        onStop: handleRecordingStop,
      });

      chunksRef.current = [];
      startTimeRef.current = Date.now();
      mediaRecorderRef.current.start(1000);
      setState((prev) => ({ ...prev, isRecording: true }));
      return true;
    } catch (error) {
      console.error("Recording error:", error);
      return false;
    }
  };

  const stopRecording = () => {
    cleanupRecording(
      mediaRecorderRef.current,
      streamRef.current,
      streamRef.current?._originalStreams
    );
    streamRef.current = null;
    setState((prev) => ({ ...prev, isRecording: false }));
  };

  const resetRecording = () => {
    stopRecording();
    if (state.recordedVideoUrl) URL.revokeObjectURL(state.recordedVideoUrl);
    setState({
      isRecording: false,
      recordedBlob: null,
      recordedVideoUrl: "",
      recordingDuration: 0,
    });
    startTimeRef.current = null;
  };

  return {
    ...state,
    startRecording,
    stopRecording,
    resetRecording,
  };
};