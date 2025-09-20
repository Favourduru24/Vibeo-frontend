import { DEFAULT_VIDEO_CONFIG, DEFAULT_RECORDING_CONFIG } from "@/constants";
import qs from "query-string";

export function formUrlQuery({ params, key, value }) {
    const currentUrl = qs.parse(params)
  
    currentUrl[key] = value
  
    return qs.stringifyUrl(
      {
        url: window.location.pathname,
        query: currentUrl,
      },
      { skipNull: true }
    )
  }

  export function removeKeysFromQuery({ params, keysToRemove }) {
    const currentUrl = qs.parse(params)
  
    keysToRemove.forEach(key => {
      delete currentUrl[key]
    })
  
    return qs.stringifyUrl(
      {
        url: window.location.pathname,
        query: currentUrl,
      },
      { skipNull: true }
    )
  }

export const getMediaStreams = async (withMic, withCamera = false) => {
  const displayStream = await navigator.mediaDevices.getDisplayMedia({
    video: DEFAULT_VIDEO_CONFIG,
    audio: true,
  });

  const hasDisplayAudio = displayStream.getAudioTracks().length > 0;
  let micStream = null;
  let cameraStream = null;

  if (withMic) {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micStream.getAudioTracks().forEach((track) => (track.enabled = true));
  }

  if (withCamera) {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 320 },
        height: { ideal: 240 },
        frameRate: { ideal: 30 }
      }
    });
  }

  return { displayStream, micStream, cameraStream, hasDisplayAudio };
};

// export const createAudioMixer = (
//   ctx,
//   displayStream,
//   micStream,
//   hasDisplayAudio
// ) => {
//   if (!hasDisplayAudio && !micStream) return null;

//   const destination = ctx.createMediaStreamDestination();
//   const mix = (stream, gainValue) => {
//     const source = ctx.createMediaStreamSource(stream);
//     const gain = ctx.createGain();
//     gain.gain.value = gainValue;
//     source.connect(gain).connect(destination);
//   };

//   if (hasDisplayAudio) mix(displayStream, 0.7);
//   if (micStream) mix(micStream, 1.5);

//   return destination;
// };

export const createAudioMixer = (audioContext, displayStream, micStream, hasDisplayAudio) => {
  const destination = audioContext.createMediaStreamDestination();
  if (hasDisplayAudio) {
    const displaySource = audioContext.createMediaStreamSource(displayStream);
    displaySource.connect(destination);
  }
  if (micStream) {
    const micSource = audioContext.createMediaStreamSource(micStream);
    micSource.connect(destination);
  }
  return destination;
}

export const setupMediaRecorder = (stream) => {
  try {
    return new MediaRecorder(stream, DEFAULT_RECORDING_CONFIG);
  } catch {
    return new MediaRecorder(stream);
  }
};

export const getVideoDuration = (url) =>
  new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const duration =
        isFinite(video.duration) && video.duration > 0
          ? Math.round(video.duration)
          : null;
      URL.revokeObjectURL(video.src);
      resolve(duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      resolve(null);
    };
    video.src = url;
  });

export const setupRecording = (
  stream,
  handlers
) => {
  const recorder = new MediaRecorder(stream, DEFAULT_RECORDING_CONFIG);
  recorder.ondataavailable = handlers.onDataAvailable;
  recorder.onstop = handlers.onStop;
  return recorder;
};

export const cleanupRecording = (
  recorder,
  stream,
  originalStreams = []
) => {
  if (recorder?.state !== "inactive") {
    recorder?.stop();
  }

  stream?.getTracks().forEach((track) => track.stop());
  originalStreams.forEach((s) =>
    s.getTracks().forEach((track) => track.stop())
  );
};

export const createRecordingBlob = (
  chunks
)=> {
  const blob = new Blob(chunks, { type: "video/webm" });
  const url = URL.createObjectURL(blob);
  return { blob, url };
};

export const calculateRecordingDuration = (startTime) =>
  startTime ? Math.round((Date.now() - startTime) / 1000) : 0;

export function parseTranscript(transcript) {
  const lines = transcript.replace(/^WEBVTT\s*/, "").split("\n");
  const result = [];
  let tempText = [];
  let startTime = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    const timeMatch = trimmedLine.match(
      /(\d{2}:\d{2}:\d{2})\.\d{3}\s-->\s(\d{2}:\d{2}:\d{2})\.\d{3}/
    );

    if (timeMatch) {
      if (tempText.length > 0 && startTime) {
        result.push({ time: startTime, text: tempText.join(" ") });
        tempText = [];
      }
      startTime = timeMatch[1] ?? null;
    } else if (trimmedLine) {
      tempText.push(trimmedLine);
    }

    if (tempText.length >= 3 && startTime) {
      result.push({ time: startTime, text: tempText.join(" ") });
      tempText = [];
      startTime = null;
    }
  }

  if (tempText.length > 0 && startTime) {
    result.push({ time: startTime, text: tempText.join(" ") });
  }

  return result;
}

export function daysAgo(inputDate) {
  const input = new Date(inputDate);
  const now = new Date();

  const diffTime = now.getTime() - input.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "1 day ago";
  } else {
    return `${diffDays} days ago`;
  }
}
