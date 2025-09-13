'use client'
import { useState, useRef, useEffect } from "react";
import {
  getMediaStreams,
  createAudioMixer,
  setupRecording,
  cleanupRecording,
  createRecordingBlob,
  calculateRecordingDuration,
} from "@/utils";

// export const useScreenRecording = () => {
//   const [state, setState] = useState({
//     isRecording: false,
//     recordedBlob: null,
//     recordedVideoUrl: "",
//     recordingDuration: 0,
//   });

//   const mediaRecorderRef = useRef(null);
//   const streamRef = useRef(null);
//   const chunksRef = useRef([]);
//   const audioContextRef = useRef(null);
//   const startTimeRef = useRef(null);

//   useEffect(() => {
//     return () => {
//       stopRecording();
//       if (state.recordedVideoUrl) URL.revokeObjectURL(state.recordedVideoUrl);
//       audioContextRef.current?.close().catch(console.error);
//     };
//   }, [state.recordedVideoUrl]);

//   const handleRecordingStop = () => {
//     const { blob, url } = createRecordingBlob(chunksRef.current);
//     const duration = calculateRecordingDuration(startTimeRef.current);

//     setState((prev) => ({
//       ...prev,
//       recordedBlob: blob,
//       recordedVideoUrl: url,
//       recordingDuration: duration,
//       isRecording: false,
//     }));
//   };

//   const startRecording = async (withMic = true) => {
//     try {
//       stopRecording();

//       const { displayStream, micStream, hasDisplayAudio } =
//         await getMediaStreams(withMic);
//       const combinedStream = new MediaStream() 

//       displayStream
//         .getVideoTracks()
//         .forEach((track) => combinedStream.addTrack(track));

//       audioContextRef.current = new AudioContext();
//       const audioDestination = createAudioMixer(
//         audioContextRef.current,
//         displayStream,
//         micStream,
//         hasDisplayAudio
//       );

//       audioDestination?.stream
//         .getAudioTracks()
//         .forEach((track) => combinedStream.addTrack(track));

//       combinedStream._originalStreams = [
//         displayStream,
//         ...(micStream ? [micStream] : []),
//       ];
//       streamRef.current = combinedStream;

//       mediaRecorderRef.current = setupRecording(combinedStream, {
//         onDataAvailable: (e) => e.data.size && chunksRef.current.push(e.data),
//         onStop: handleRecordingStop,
//       });

//       chunksRef.current = [];
//       startTimeRef.current = Date.now();
//       mediaRecorderRef.current.start(1000);
//       setState((prev) => ({ ...prev, isRecording: true }));
//       return true;
//     } catch (error) {
//       console.error("Recording error:", error);
//       return false;
//     }
//   };

//   const stopRecording = () => {
//     cleanupRecording(
//       mediaRecorderRef.current,
//       streamRef.current,
//       streamRef.current?._originalStreams
//     );
//     streamRef.current = null;
//     setState((prev) => ({ ...prev, isRecording: false }));
//   };

//   const resetRecording = () => {
//     stopRecording();
//     if (state.recordedVideoUrl) URL.revokeObjectURL(state.recordedVideoUrl);
//     setState({
//       isRecording: false,
//       recordedBlob: null,
//       recordedVideoUrl: "",
//       recordingDuration: 0,
//     });
//     startTimeRef.current = null;
//   };

//   return {
//     ...state,
//     startRecording,
//     stopRecording,
//     resetRecording,
//   };
// };



// import { useState, useRef, useEffect } from "react";

// const DEFAULT_VIDEO_CONFIG = {
//   width: { ideal: 1920 },
//   height: { ideal: 1080 },
//   frameRate: { ideal: 30 },
// };

// const DEFAULT_RECORDING_CONFIG = {
//   mimeType: "video/webm;codecs=vp9",
//   audioBitsPerSecond: 128000,
//   videoBitsPerSecond: 2500000,
// };

export const useScreenRecording = () => {
  const [state, setState] = useState({
    isRecording: false,
    recordedBlob: null,
    recordedVideoUrl: "",
    recordingDuration: 0,
    error: null,
  });

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const startTimeRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    return () => {
      stopRecording();
      if (state.recordedVideoUrl) {
        URL.revokeObjectURL(state.recordedVideoUrl);
      }
      if (audioContextRef.current?.state !== "closed") {
        audioContextRef.current?.close().catch(console.error);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.recordedVideoUrl]);

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      chunksRef.current.push(event.data);
    }
  };

  const handleRecordingStop = () => {
    try {
      const { blob, url } = createRecordingBlob(chunksRef.current);
      const duration = calculateRecordingDuration(startTimeRef.current);

      setState((prev) => ({
        ...prev,
        recordedBlob: blob,
        recordedVideoUrl: url,
        recordingDuration: duration,
        isRecording: false,
        error: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isRecording: false,
        error: "Failed to create recording blob",
      }));
      console.error("Recording stop error:", error);
    }
  };

  const processCameraVideo = (cameraStream, displayStream, micStream, hasDisplayAudio) => {
    return new Promise((resolve) => {
      const cameraVideo = document.createElement('video');
      cameraVideo.srcObject = cameraStream;
      cameraVideo.play();

      const screenVideo = document.createElement('video');
      screenVideo.srcObject = displayStream;
      screenVideo.play();

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvasRef.current = canvas;
      
      screenVideo.onloadedmetadata = () => {
        canvas.width = screenVideo.videoWidth;
        canvas.height = screenVideo.videoHeight;

        const drawFrame = () => {
          if (!state.isRecording) return;
          
          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw screen video
          ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
          
          // Draw camera PIP
          const pipWidth = canvas.width * 0.2;
          const pipHeight = (pipWidth * 9) / 16;
          const pipX = canvas.width - pipWidth - 20;
          const pipY = 20;
          
          ctx.drawImage(cameraVideo, pipX, pipY, pipWidth, pipHeight);
          
          // Add border to PIP
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.strokeRect(pipX, pipY, pipWidth, pipHeight);
          
          animationFrameRef.current = requestAnimationFrame(drawFrame);
        };

        drawFrame();
        
        const compositeStream = canvas.captureStream(30);
        
        // Add audio from mixed source
        if (audioContextRef.current) {
          const audioDestination = createAudioMixer(
            audioContextRef.current,
            displayStream,
            micStream,
            hasDisplayAudio
          );
          if (audioDestination) {
            audioDestination.stream.getAudioTracks().forEach(track => {
              compositeStream.addTrack(track);
            });
          }
        }
        
        streamRef.current = compositeStream;
        
        // Setup media recorder
        try {
          mediaRecorderRef.current = new MediaRecorder(compositeStream, DEFAULT_RECORDING_CONFIG);
        } catch (error) {
          console.warn("Using default MediaRecorder due to error:", error);
          mediaRecorderRef.current = new MediaRecorder(compositeStream);
        }
        
        mediaRecorderRef.current.ondataavailable = handleDataAvailable;
        mediaRecorderRef.current.onstop = handleRecordingStop;
        mediaRecorderRef.current.start();
        
        resolve();
      };
    });
  };

  const startRecording = async (withMic = true, withCamera = false) => {
    try {
      stopRecording();
      chunksRef.current = [];

      const { displayStream, micStream, cameraStream, hasDisplayAudio } = 
        await getMediaStreams(withMic, withCamera);

      // Setup audio mixing
      if (hasDisplayAudio || micStream) {
        try {
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        } catch (audioError) {
          console.warn("Audio context creation failed:", audioError);
        }
      }

      if (cameraStream) {
        await processCameraVideo(cameraStream, displayStream, micStream, hasDisplayAudio);
      } else {
        // No camera, just record screen with audio
        const combinedStream = new MediaStream();
        
        // Add screen video track
        displayStream.getVideoTracks().forEach((track) => {
          combinedStream.addTrack(track);
        });

        // Add audio if available
        if (audioContextRef.current) {
          const audioDestination = createAudioMixer(
            audioContextRef.current,
            displayStream,
            micStream,
            hasDisplayAudio
          );

          if (audioDestination) {
            audioDestination.stream
              .getAudioTracks()
              .forEach((track) => combinedStream.addTrack(track));
          }
        } else {
          // Fallback: add audio tracks directly
          if (hasDisplayAudio) {
            displayStream.getAudioTracks().forEach((track) => combinedStream.addTrack(track));
          }
          if (micStream) {
            micStream.getAudioTracks().forEach((track) => combinedStream.addTrack(track));
          }
        }

        streamRef.current = combinedStream;
        
        // Setup media recorder
        try {
          mediaRecorderRef.current = new MediaRecorder(combinedStream, DEFAULT_RECORDING_CONFIG);
        } catch (error) {
          console.warn("Using default MediaRecorder due to error:", error);
          mediaRecorderRef.current = new MediaRecorder(combinedStream);
        }
        
        mediaRecorderRef.current.ondataavailable = handleDataAvailable;
        mediaRecorderRef.current.onstop = handleRecordingStop;
        mediaRecorderRef.current.start();
      }

      startTimeRef.current = Date.now();
      setState((prev) => ({ ...prev, isRecording: true, error: null }));
      return true;

    } catch (error) {
      console.error("Recording error:", error);
      setState((prev) => ({
        ...prev,
        isRecording: false,
        error: "Failed to start recording"
      }));
      return false;
    }
  };

  const stopRecording = () => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      setState((prev) => ({ ...prev, isRecording: false }));
    } catch (error) {
      console.error("Stop recording error:", error);
    }
  };

  const resetRecording = () => {
    stopRecording();
    if (state.recordedVideoUrl) {
      URL.revokeObjectURL(state.recordedVideoUrl);
    }
    setState({
      isRecording: false,
      recordedBlob: null,
      recordedVideoUrl: "",
      recordingDuration: 0,
      error: null,
    });
    chunksRef.current = [];
    startTimeRef.current = null;
  };

  return {
    ...state,
    startRecording,
    stopRecording,
    resetRecording,
  };
};


// Utility functions remain mostly the same, but with added error handling
//Me and Camera



// export const getMediaStreams = async (withMic) => {
//   const displayStream = await navigator.mediaDevices.getDisplayMedia({
//     video: DEFAULT_VIDEO_CONFIG,
//     audio: true, // This prompts for audio, but user must select it
//   });

//   // Check if display stream actually has audio tracks
//   const hasDisplayAudio = displayStream.getAudioTracks().length > 0;

//   let micStream = null;
//   if (withMic) {
//     try {
//       micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       micStream.getAudioTracks().forEach((track) => (track.enabled = true));
//     } catch (micError) {
//       console.error("Microphone access failed:", micError);
//       // Handle error but don't necessarily break recording
//     }
//   }

//   return { displayStream, micStream, hasDisplayAudio };
// };


// const startRecording = async (withMic = true, withCamera = false) => {
//   try {
//     stopRecording();

//     const { displayStream, micStream, cameraStream, hasDisplayAudio } = 
//       await getMediaStreams(withMic, withCamera);

//     const combinedStream = new MediaStream();

//     // Add screen video track
//     displayStream.getVideoTracks().forEach((track) => {
//       combinedStream.addTrack(track);
//     });

//     // Setup audio mixing
//     if (hasDisplayAudio || micStream) {
//       try {
//         audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
//         const audioDestination = createAudioMixer(
//           audioContextRef.current,
//           displayStream,
//           micStream,
//           hasDisplayAudio
//         );

//         if (audioDestination) {
//           audioDestination.stream
//             .getAudioTracks()
//             .forEach((track) => combinedStream.addTrack(track));
//         }
//       } catch (audioError) {
//         console.warn("Audio mixing failed:", audioError);
//       }
//     }

//     // Store camera stream separately for canvas processing
//     if (cameraStream) {
//       // We'll process camera video separately using canvas
//       processCameraVideo(cameraStream, combinedStream);
//     } else {
//       streamRef.current = combinedStream;
//       setupMediaRecorder(combinedStream);
//     }
    

//     startTimeRef.current = Date.now();
//     setState((prev) => ({ ...prev, isRecording: true, error: null }));
//     return true;

//   } catch (error) {
//     console.error("Recording error:", error);
//     setState((prev) => ({
//       ...prev,
//       isRecording: false,
//       error: "Failed to start recording"
//     }));
//     return false;
//   }
// };




// In your useScreenRecording hook, update the return:
// return {
//   ...state,
//   startRecording, // Now accepts withCamera parameter
//   stopRecording,
//   resetRecording,
// };

// Usage in your component:
// const { startRecording } = useScreenRecording();

// Start recording with microphone and camera
// const handleStartWithCamera = () => {
//   startRecording(true, true); // withMic = true, withCamera = true
// };

// // Start recording with microphone only
// const handleStartWithoutCamera = () => {
//   startRecording(true, false); // withMic = true, withCamera = false
// };

// export default function ScreenRecorder() {
//   const { isRecording, startRecording, stopRecording, recordedVideoUrl } = useScreenRecording();

//   return (
//     <div>
//       <button 
//         onClick={() => startRecording(true, true)} // Record with mic and camera
//         disabled={isRecording}
//       >
//         Start Recording with Camera
//       </button>
      
//       <button 
//         onClick={() => startRecording(true, false)} // Record with mic only
//         disabled={isRecording}
//       >
//         Start Recording (No Camera)
//       </button>

//       <button onClick={stopRecording} disabled={!isRecording}>
//         Stop Recording
//       </button>

//       {recordedVideoUrl && (
//         <video 
//           src={recordedVideoUrl} 
//           controls 
//           style={{ width: '100%', marginTop: '20px' }}
//         />
//       )}
//     </div>
//   );
// }