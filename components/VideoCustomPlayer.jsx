'use client'
import { useState, useRef, useEffect } from "react"

const VideoCustomPlayer = ({videoUrl}) => {

  const [playing, setPlaying] = useState(false)
  const [theater, setTheater] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [muted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const [miniPlayer, setMiniPlayer] = useState(false)
  const videoRef = useRef(null)
  const videoContainerRef = useRef()


   useEffect(() => {
       const handleKeyDown = (e) => {
          switch(e.key.toLowerCase()) {
            case ' ':
              togglePlayPause()
              break
            case 'arrowright':
            case 'l':
               skip(5)
               break;
            case 'arrowleft':
            case 'j':
               skip(-5)
               break;
          }
       }

       document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
   }, [playing, playbackRate])

  useEffect(() => {
     const video = videoRef.current

     const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime)
        setProgress((video.currentTime / video.duration) * 100)
     }
      
      const handleLoadedMetaData = () => {
         setDuration(video.duration)
      }

      const handleEnded = () => {
         setPlaying(false)
      }
      
      video.addEventListener('timeupdate', handleTimeUpdate)
      video.addEventListener('loadedmetadata', handleLoadedMetaData)
      video.addEventListener('ended', handleEnded)

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetaData)
      video.removeEventListener('ended', handleEnded)
      }

  },[])

   

   useEffect(() => {
       const video = videoRef.current

       const handleFullscreenChange = () => {
         setFullscreen(document.fullscreenElement === videoContainerRef.current)
       }

       const handleMiniPlayerEnter = () => {
             setMiniPlayer(true)
         }

       const handleMiniPlayerLeave = () => {
          setMiniPlayer(false)
         }

    

       document.addEventListener('fullscreenchange', handleFullscreenChange)
       video.addEventListener('enterpictureinpicture', handleMiniPlayerEnter)
       video.addEventListener('leavepictureinpicture', handleMiniPlayerLeave)

       return () =>  {
        document.removeEventListener('fullscreenchange', handleFullscreenChange)
        video.removeEventListener('enterpictureinpicture', handleMiniPlayerEnter)
        video.removeEventListener('leavepictureinpicture', handleMiniPlayerLeave)
       }

   }, [])

    useEffect(() => {
        let timeout
       if(playing) {
           timeout = setTimeout(() => {
             setShowControls(false)
           }, 3000)
       }

       return () => clearTimeout(timeout)
    },[playing, showControls])

   const togglePlayPause = () => {
       if(playing) {
          videoRef.current.pause()
          setPlaying(false)
       } else {
         videoRef.current.play()
          setPlaying(true)
       }
   }

   const handleTheaterMode = () => {
     setTheater(!theater)
   }
   const toggleFullscreen = () => {
     if(!document.fullscreenElement) {
       videoContainerRef.current.requestFullscreen().catch(err => {
         console.error('Error attempting to enable fullscreen:', err.message)
       })
     } else {
       document.exitFullscreen()
     }
   }

   const toggleMiniPlyer = () => {
     if(miniPlayer) {
      document.exitPictureInPicture()
     } else {
       videoRef.current.requestPictureInPicture().catch(err => {
         console.error('Error attempting to enable miniplayer:', err.message)
       })

     }
   }

    const skip = (secounds) => {
       videoRef.current.currentTime += secounds
       setShowControls(true)
    }

    const toggleVideoMuted = () => {
       videoRef.current.muted = !muted
       setIsMuted(!muted)
    }

    const handleVolumeChange = (e) => {
     const newVolume = parseFloat(e.target.value)
      videoRef.current.volume = newVolume
      setVolume(newVolume)
      setIsMuted(newVolume === 0)
    }

    const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
  };

  return (
    <div className={`relative ${theater ? 'theater' : 'w-[100%] max-w-[1000px] rounded-lg'}  rounded-lg h-[70vh]`} onMouseMove={() => setShowControls(true)} onMouseLeave={() => setShowControls(playing ? false : true)} ref={videoContainerRef} onDoubleClick={toggleFullscreen}>
       <video src={videoUrl} className={`w-full h-full md:rounded-lg ${theater ? 'object-contain' : 'object-cover'}`} ref={videoRef} onClick={togglePlayPause}/>

       <div className={`absolute bottom-0 left-0 right-0 text-white transition-opacity duration-200 w-full  ${showControls ? 'opacity-100' : 'opacity-0'}`}>

           <div className="w-[98%] h-[0.2rem] transition-all duration-200 hover:h-[0.25rem] bg-gray-600 cursor-pointer group  mx-auto relative" onClick={handleProgressClick}>
          <div
            className="absolute top-0 left-0 h-full bg-red-600"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute -top-[1px] h-2 w-2 bg-red-600 rounded-full -translate-x-1/2 opacity-0 group-hover:opacity-100"
            style={{ left: `${progress}%` }}
          />
        </div>

           <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                  <div className="flex items-center sm:gap-4 gap-2">
                      <button className="cursor-pointer" onClick={togglePlayPause}>
                            <img src={`${!playing ? '/assets/icons/play.png' : '/assets/pause.png'} `} className="sm:size-6" alt="play"/>
                      </button>
                      <button className="cursor-pointer transition-all duration-700 transition-transform" onClick={toggleVideoMuted}>
                            <img src={muted ? '/assets/volume-off.png' : volume > 0.6 ? '/assets/volume-up.png' : '/assets/volume-down.png'} className="size-6" alt="play"/>
                      </button>
                      <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 accent-red-500 h-[4px] transition-all transition-transform"
              />

              <div className="text-[10px] select-none md:text-sm whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
                  </div>
                  <div className="flex items-center sm:gap-4 gap-2">
                    <button className="" onClick={toggleMiniPlyer}>
                            <img src={`${!miniPlayer ? '/assets/mini.png' : '/assets/pause.svg'} `} className="sm:size-6 size-5" alt="play"/>
                      </button>
                      {!fullscreen &&
                      <button className="cursor-pointer" onClick={handleTheaterMode}>
                            <img src={`${'/assets/theater.png'} `} className="sm:size-6 size-5" alt="play"/>
                      </button>}
                      <button className="cursor-pointer" onClick={toggleFullscreen}>
                            <img src={`${fullscreen ? '/assets/exit-fullscreen.png' : '/assets/fullscreen.png'} `} className="sm:size-6 size-5" alt="screen"/>
                      </button>
                  </div>
           </div>
       </div>
    </div>
  )
}

export default VideoCustomPlayer