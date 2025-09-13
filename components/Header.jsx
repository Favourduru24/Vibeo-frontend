'use client'
import Image from "next/image"
 import MDEditor from  '@uiw/react-md-editor'
import { useState, useEffect, useRef } from "react"
import CustomSelect from '@/components/CustomSelect'
import Link from "next/link"
import useAuth from "@/hooks/useAuth"
import { MAX_VIDEO_SIZE, videoType, videoCategory, navLink } from "@/constants"
import { uploadConfig } from "@/app/api/axois"
import { useScreenRecording } from "@/hooks/useScreenRecording"
import { useFileInput } from "@/hooks/useFileHandle"
import { useAddNewVideoMutation } from "@/features/video/videoApiSlice"
import { useAddNewShortMutation } from "@/features/short-video/shortApiSlice"
import {useAddNewRecordMutation} from '@/features/recorded-video/recordedVideoApiSlice'
import {usePathname} from 'next/navigation'
import SideBar from "./SideBar"

const Header = () => {
        
  
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [videoTypeState, setVideoTypeState] = useState('')
  const [videoCategoryState, setVideoCategoryState] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  // const {id: userId, username} = useAuth()
  const userId = '123'
  const username = 'Duru Pristine'
  const [recordOpen, setRecordOpen] = useState(false)
  const [addNewVideo, {isLoading, isSuccess}] = useAddNewVideoMutation()
  const [addNewShortVideo, {isLoading: loadingShort, isSuccess: shortIsSuccess}] = useAddNewShortMutation()
  const [addScreenRecordedVideo, {isLoading: loadingRecordedVideo, isSuccess: recordedVideoIsSuccess}] = useAddNewRecordMutation()
  const screenVideoRef = useRef(null)
  const video = useFileInput(MAX_VIDEO_SIZE)
  const [openSearch, setOpenSearch] = useState(true)
  const [sliderOpen, setsliderOpen] = useState(false);
   
   const [isOpen, setIsOpen] = useState(false)

  const sidebarRef = useRef(null)
  const modalRef = useRef(null);
  const dropdownRef = useRef(null);
  const videoRef = useRef(null)
  const fileInputRef = useRef(null)
  const pathname = usePathname()


  const {
        resetRecording,
        startRecording,
        stopRecording,
        isRecording,
        recordedBlob,
        recordedVideoUrl,
        recordingDuration,
        state
   } = useScreenRecording()


    

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
      
      if (open && modalRef.current && !modalRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setOpen(false);
      }  
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, open]);

  useEffect(() => {
       if(video.previewUrl) {
        setShow(true)
       }
  },[video.previewUrl])

   useEffect(() => {
          const handleClickOutside = (e) => {
            if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
              setIsOpen(false);
            }
          };
      
          const handleEscape = (e) => {
            if (e.key === "Escape") setIsOpen(false);
          };
      
          document.addEventListener("mousedown", handleClickOutside);
          document.addEventListener("keydown", handleEscape);
      
          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
          };
        }, []);

   const uploadThumbnail = async () => {
  try {
    const formData = new FormData();
    formData.append('image', thumbnail);
    const res = await uploadConfig.post('/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return  res.data
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

const uploadVideoUrl = async () => {
  try {
    const formData = new FormData();
    formData.append('video', video.file); // Use the file from your useFileInput hook
    
      console.log('Uploading video file:', video.file.name, 'Size:', video.file.size);

    const res = await uploadConfig.post('/upload-video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return  res.data
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
};

async function fetchAllData() {
  try {
       
    const [imgUrl, vUrl] = await Promise.all([
      uploadThumbnail(),
      uploadVideoUrl(),
    ]);
    return { imgUrl, vUrl };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}


const handleCreateVideo = async (e) => {
   e.preventDefault();
  
    console.log({title, description, videoTypeState, type: 'Video'})

   const {imgUrl} = await fetchAllData()
   const {vUrl} = await fetchAllData()

    await addNewVideo({
      title,
      description,
      thumbnailUrl: imgUrl || '',
      videoUrl: vUrl || '',
      category: videoCategoryState,
      userId,
    })


};

const handleCreateShortVideo = async (e) => {
   e.preventDefault();
  
    let imgUrl = ''
    let vUrl = ''
    
    console.log({title, description, type: 'Short'})

    if(video?.file) vUrl = await uploadVideoUrl()

    await addNewShortVideo({
      title,
      description,
      videoUrl: vUrl || '',
      category: videoTypeState,
      userId,
    })


};

const handleCreateRecordedVideo = async (e) => {
   e.preventDefault();
  
   const {imgUrl} = await fetchAllData()
   const {vUrl} = await fetchAllData()

      console.log({title, description, type: 'Screen Record'})


    await addScreenRecordedVideo({
      title,
      description,
      thumbnailUrl: imgUrl || '',
      videoUrl: vUrl || '',
      category: videoTypeState,
      userId,
    })

};

  const handleUploadClick = (e) => {
   e.stopPropagation(); // Prevent event from reaching click-outside handler
    setOpen(true);
    setIsOpen(false); // Close the dropdown immediately
  };

  //  Screen Recording 

 

        const closeModal = () => {
           resetRecording()
           setRecordOpen((prev) => !prev)
        }

        const recordAgain = async () => {
           resetRecording()
           await startRecording()

           if(recordedVideoUrl && screenVideoRef.current) {
              screenVideoRef.current.src = recordedVideoUrl
           }
        }

        const gotoUpload = () => {
           setRecordOpen(false)
           setOpen(true);
           setShow(true)

           if(!recordedBlob) return

            const url = URL.createObjectURL(recordedBlob)

            sessionStorage.setItem('recordedVideo', 
               JSON.stringify({
                 url,
                 name: 'screen-recording.webm',
                 type: recordedBlob.type,
                 size: recordedBlob.size,
                 duration: recordingDuration || 0
               })
            )
        }

        useEffect(() => {
            const checkForRecordedVideo = async () => {
               try {
                  const stored = sessionStorage.getItem('recordedVideo')
                  if(!stored) return 
                   
                  const {url, name, type, duration} = JSON.parse(stored)
                  const blob = await fetch(url).then((res) => res.blob())
                  const file = new File([blob], name, {type, lastModified: Date.now()})

                  if(video.inputRef.current) {
                     const dataTransfer = new DataTransfer()
                     dataTransfer.items.add(file)
                     video.inputRef.current.files = dataTransfer.files

                     const event = new Event('change', {bubbles: true})
                     video.inputRef.current.dispatchEvent(event)
                     video.handleFileChange({
                       target: {files: dataTransfer.files}
                     })
                  }

                    setVideoTypeState('Screen Record')

                    sessionStorage.removeItem('recordedVideo')
                  URL.revokeObjectURL(url)

                  } catch (error) {
                 console.error(error, 'Error loading recorded video')
               }
            }

            checkForRecordedVideo()
        }, [video])

        const handleVideoSrcSet = () => {
        if(window.innerWidth < 960 && !openSearch) {
          setOpenSearch(false)
        } else {
        setOpenSearch(true)
        }
      }

           useEffect(() => {
        window.addEventListener('resize', handleVideoSrcSet);

        return () => {
          window.removeEventListener('reisze', handleVideoSrcSet)
        }
         }, [])

  return (
              <>
               <SideBar sliderOpen={sliderOpen} setsliderOpen={setsliderOpen}/>
              {
           recordOpen ? 
             <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/80 p-8">
                 <div className={`${recordedVideoUrl ? 'h-fit' : 'h-[19vh]'} max-w-xl w-full  rounded-md bg-gray-400 border-[1px] border-[#333333] px-2 py-3`}>

                    <div className="flex items-start justify-between cursor-pointer">
                     <p className="text-2xl text-white-100 font-sans font-semibold">Screen Recording</p>
                     <div className="w-10 h-10 bg-black rounded-md flex items-center justify-center" onClick={closeModal}>
                     <p className="text-2xl text-white-100 font-sans font-semibold">X</p>
                    </div>
                    </div>

                     {isRecording ? 
                       <article className="flex flex-col gap-2 h-full justify-center items-center">
                              <div className="flex items-center gap-2 justify-center">
                             <p className="text-md text-white-100 font-sans font-semibold text-center">Recording</p>
                              <span className="relative flex h-3 w-3 flex justify-center items-center ">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-95"/>
                         <span className="relative inline-flex rounded-full h-2 w-2 border-2 border-black-100 bg-red-500"/>
                                  </span>
                              </div>
                              <div className={`w-full max-w-lg flex`}>
                               <button className="w-full h-9 rounded-full bg-[#000000] text-white-100 font-semibold text-[15px] ring-1 ring-white/50  cursor-pointer" onClick={stopRecording}>
                                Stop Record
                               </button>
                              </div>
                       </article>
                    : recordedVideoUrl ? 
                     <div className="flex flex-col gap-4">
                    <div className="flex mt-5">
                     <video ref={screenVideoRef}   src={state.recordedVideoUrl} controls className="rounded-lg"/>
                    </div>
                        <div className="flex h-full justify-center items-center flex-col gap-3 my-3">
                            <div className={`w-full max-w-lg flex gap-3 `}>
                               <button className="w-full h-10 rounded-full bg-[#000000] text-white-100 font-semibold text-[15px] ring-1 ring-white/50 cursor-pointer" onClick={recordAgain}>
                               Record Again
                               </button>
                               {recordedVideoUrl && <button className="w-full h-10 rounded-full bg-[#000000] text-white-100 font-semibold text-[15px] ring-1 ring-white/50 cursor-pointer" onClick={gotoUpload}>
                               Continue to upload
                               </button>}
                            </div>
                         
                               </div>
                    </div> : ''}
                           {!isRecording && !recordedVideoUrl &&  
                            <div className="flex h-full justify-center items-center flex-col gap-2 mb-4">
                              <p className="text-[1rem] text-white-100 font-sans ">click here to capture screen.</p>
                             
                        <button className="w-full h-9 rounded-full bg-[#000000] text-white-100 font-semibold text-[15px] ring-1 ring-white/50 cursor-pointer" onClick={() => startRecording(true, true)}>
                               Start Record
                               </button>
                            </div>
                            }
                           
                 </div>

             </div> : ''
             }

            {open && <div className='fixed inset-0 z-50 flex justify-center items-center bg-black/80 p-8'>
            <div className="max-w-4xl sm:h-[90vh] h-full rounded-md sm:rounded-xl w-full bg-gray-400 border-[1px] border-[#333333] flex flex-col p-2 relative" ref={modalRef}>
               <div className="p-3">
                  <p className="text-2xl text-white-100 font-sans font-semibold">Upload Videos</p>
               </div>
               {/* Start */} 
                <div className={`${!show ? 'block transition-all duration-700' : 'hidden transition-all duration-700'} flex border-t-[0.5px] border-[#333333] h-full transition-transform transition-all duration-700 flex-col items-center justify-center
                `}>
                    <div className="flex flex-col justify-center items-center gap-4">
                           <div className="w-34 h-34 bg-[#000000] rounded-full border-[1px] border-[#333333]">

                           </div>
                           <div className="flex flex-col justify-center items-center leading-0 gap-6 mt-4">
                            <p className="text-[16px] text-white-100 font-sans font-semibold">Drag and drop videos file to upload</p>
                            <p className="text-[14px] text-white/50 font-sans font-semibold">Your video will be private until you publish them</p>
                           </div>
                        
                        <button className="w-28 h-9 rounded-full bg-white-100 text-[#000000] font-semibold text-[15px] mt-4 ring-2 ring-white/50 cursor-pointer" onClick={() => video.inputRef.current.click()}>
                            <input type='file' className="hidden"  onChange={video.handleFileChange}  ref={video.inputRef} accept="video/*"/>
                            Select files
                        </button>
                    </div>
                </div>
                {/* End */}

               {show && <div className="w-full flex gap-2 h-full p-3 border-t-[0.5px] border-[#333333]">
                  <div className="bg-white-10 w-[60%] p-2">
                       <form className="flex flex-col gap-5">
                         {/* first col */}
                          <div className="flex flex-col gap-2">
                        <p className="text-2xl text-white-100 font-sans font-semibold">Details</p>
                         <input type="text" className="outline-none w-full rounded-lg h-16 p-2 border-border-100 border-[0.1px] placeholder:text-white/50 text-[#f1f1f1]  m-0 transition-all duration-500 focus:ring-1 focus:ring-white/50" placeholder="video title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                          </div>
                         {/* end col */}
                         {/* first col */}
                          <div className="flex flex-col h-40 rounded-lg">
                          <MDEditor 
                        preview='edit'
                        id="pitch"
                        onChange={(value) => setDescription(value)}
                        height={300}
                        width={300}
                        value={description}
                        style={{overflow: 'hidden', backgroundColor: '#1F2225', fontSize: '14px', fontFamily: 'sans-serif'}}
                        previewOptions={{disalloedElement: ['style'], }}
                        textareaProps={{
                         placeholder:
                         "video description..."
                        }}
                        components={{
                          img: (props) => (
                            <Image 
                              {...props} 
                              width={600} 
                              height={300}
                              loader={({ src }) => src} // Bypass Next.js optimization if needed
                            />
                          )
                        }}
                        />
                          </div>
                         {/* end col */}
                         {/* first col */}
                          <div className="flex flex-col gap-2">
                        <p className="text-xl text-white-100 font-sans font-semibold">Video Type</p>
                         <div className="w-full flex gap-2 ">
                    <CustomSelect value={videoTypeState} onChange={setVideoTypeState} options={videoType} placeholder="Select the video type" className="w-full text-gray-300 font-sans"/>
               </div>
               <p className="text-xl text-white-100 font-sans font-semibold">Video Category</p>
                         <div className="w-full flex gap-2 ">
                    <CustomSelect value={videoCategoryState

                    } onChange={setVideoCategoryState} options={videoCategory} placeholder="Select the video category" className="w-full text-gray-300 font-sans"/>
               </div>
                          </div>
                         {/* end col */}
                         {/* first col */}
                         {videoTypeState === 'Short' ?
                          '' 
                        :
                          <div className="flex flex-col gap-2">
                        <p className="text-xl text-white-100 font-sans font-semibold">Video Thumbnail</p>
                         <div className="sm:w-full h-34 w-full flex items-center justify-center border-[#4B4D4F] rounded-xl bg-[#1F2225] border-[1.0px] cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                   <input type="file"  className="hidden" onChange={(e) => setThumbnail(e.target.files[0])} accept='image/*' ref={fileInputRef}/>
                     
                     {!thumbnail && (
                        <div className='text-white flex flex-col justify-center w-full items-center'>
                          <h3 className='text-2xl text-gray-500 '>Upload Image</h3>
                          <p className='text-center text-sm text-gray-500 font-semibold'>image must be less than 20mb</p>
                        </div>
                     )}
                   {thumbnail && 
                        <Image src={URL.createObjectURL(thumbnail)}  width={1000} height={200} alt="image" className='object-contai rounded-xl w-full h-full'/>
             }
             
               </div>
                          </div> }
                         {/* end col */}

                        </form>   
                  </div>
                  <div className="bg-white-10 w-[40%] ">
                      <div className="h-[18rem] flex flex-col sm:mt-13 px-2">
                         <div className="h-[70%] bg-black-100 rounded-t-lg flex items-center justify-center">
                              <video src={video.previewUrl && video.previewUrl} controls></video>
                         </div>
                         <div className="h-[30%] bg-gray-400 border-[2px] border-[#333333] shadow-xl shadow-gray-400 rounded-b-lg flex flex-col p-2 items- justify-end">
                              <p className="text-lg text-white/50 font-sans font-semibold">Filename</p>
                              <p className="text-[14px] text-white-100 font-sans font-semibold">{video.file?.name}</p>
                         </div>
                      </div>
                  </div>
               </div> }
                   <div className="flex items-center gap-2 absolute bottom-4 right-4 ">

                    <button className="w-28 h-9 rounded-full bg-[#000000] text-white-100 font-semibold text-[15px] mt-4 ring-1 ring-white/50 cursor-pointer" 
                onClick={() => {setShow((prev) => !prev) }} disabled={!video.previewUrl}
                >
                            {!show ? 'Next' : 'Back'}
                        </button>
                

                       {show && <button className=" w-28 h-9 rounded-full bg-[#000000] text-white-100 font-semibold text-[15px] mt-4 ring-1 ring-white/50 cursor-pointer" 
                onClick={
                  videoTypeState === 'Screen Record' ?
                     handleCreateRecordedVideo : 
                          videoTypeState === 'Video' ?
                             handleCreateVideo : videoTypeState === 'Short' ?
                         handleCreateShortVideo : null }
                >
                      {isSuccess || shortIsSuccess || recordedVideoIsSuccess ? 'Posted' : 'Post'}
                </button> }
                   </div>
                
            </div>
        </div>}

          {!openSearch ? (
            <div className="py-2 px-5 fixed top-0 left-0 right-0 z-10 gap-2 w-full flex justify-center flex-grow" ref={sidebarRef}>
               <div className="flex items-center w-full gap-4 justify-center">
                 <div className="flex items-center rounded-full bg-[#ffffff33] w-10 h-10 justify-center cursor-pointer md:hidden p-1 white-space-nowrap shrink-0"  onClick={() => setOpenSearch((prev) => !prev)}>
                <Image src='/assets/icons/arrow-down.png' width={24} height={24} alt="search" className="size-full shrink-0 whitespace-nowrap rotate-90"/>
               </div>
                    <div className="w-[400px] max-w-[620px] h-10 border-[0.5px] border-[#ffffff33] rounded-l-full rounded-r-full flex-grow">
            <form className="w-full h-full rounded-l-full flex items-center rounded-r-full">
                <input type="text" className="flex-grow w-full h-full p-3 rounded-l-full border-none outline-none text-[16px] font-semibold text-[#f1f1f1] placeholder:text-[#333333] focus:ring-[1px] focus:ring-[#ffffff33] transition-all" placeholder="Search"/>
                <div className="w-14 h-10 rounded-r-full bg-[#ffffff33] flex items-center justify-center cursor-pointer">
                <Image src='/assets/icons/search.png' width={24} height={24} className="size-7" alt="search"/>
             </div>
            </form>
        </div>
               </div>
          </div>
          ) : (
            <div className="flex justify-between items-center py-2 px-6 fixed top-0 left-0 right-0 z-10 gap-2" ref={sidebarRef}>
           <div className="flex gap-2 items-center">
            <Image src='/assets/icons/menu.png' width={28} height={28} alt="menu" className="size-8 cursor-pointer" onClick={() => setsliderOpen((prev) => !prev)}/>
           <p className="text-3xl font-semibold text-[#f1f1f1] whitespace-nowrap shrink-0 ">Viboe</p> 
        </div>
        <div className="w-[400px] max-w-[550px] h-10 border-[0.5px] border-[#ffffff33] rounded-l-full rounded-r-full hidden md:flex flex-grow">
            <form className="w-full h-full rounded-l-full flex items-center rounded-r-full">
                <input type="text" className="flex-grow w-full h-full p-3 rounded-l-full border-none outline-none text-[16px] font-semibold text-[#f1f1f1] placeholder:text-[#333333] focus:ring-[1px] focus:ring-[#ffffff33] transition-all" placeholder="Search"/>
                <div className="w-14 h-10 rounded-r-full bg-[#ffffff33] flex items-center justify-center cursor-pointer">
                <Image src='/assets/icons/search.png' width={24} height={24} className="size-7" alt="search"/>
             </div>
            </form>
        </div>
            <div className="flex items-center gap-4 ">
                 <div className="relative flex items-center justify-center gap-2">

               <div className="flex items-center rounded-full bg-[#ffffff33] w-10 h-10 justify-center cursor-pointer md:hidden p-1 "   onClick={() => setOpenSearch((prev) => !prev)}>
                <Image src='/assets/icons/search.png' width={24} height={24} alt="search" className="size-full shrink-0 whitespace-nowrap rotate-90"/>
               </div>

               <div className="flex items-center rounded-full bg-[#ffffff33] p-2 justify-center cursor-pointer"  onClick={() => setIsOpen((prev) => !prev)}>
                <Image src='/assets/icons/plus.png' width={24} height={24} alt="search" className="size-6 shrink-0 whitespace-nowrap"/>
                 <p className="text-[15px] font-semibold text-[#f1f1f1] whitespace-nowrap shrink-0 hidden md:flex">Create</p>
               </div>

                  {isOpen && <div className="absolute top-12 bg-black flex flex-col gap-1 z-100">
                         {userId ? 
                      <div className="text-white-100 w-[10rem] bg-[#ffffff33] h-10 flex justify-center items-center rounded-lg whitespace-nowrap ring-[1px] ring-[#ffffff33] hover:ring-3 cursor-pointer hover:ring-white/50 font-samibold" onClick={handleUploadClick}>Upload Video</div> : 
                      <Link href='/sign-in'>
                      <div className="text-white-100 w-[10rem] bg-[#ffffff33] h-10 flex justify-center items-center rounded-lg whitespace-nowrap ring-[1px] ring-[#ffffff33] hover:ring-3 cursor-pointer hover:ring-white/50 font-samibold">Upload Video</div>
                      </Link>
                      }
                      <div className="text-white-100 w-[10rem] bg-[#ffffff33] h-10 flex justify-center items-center rounded-lg whitespace-nowrap ring-[1px] ring-[#ffffff33] hover:ring-3 cursor-pointer hover:ring-white/50 font-samibold" onClick={() => setRecordOpen((prev) => !prev)}>Screen Record Video</div>
                  </div>}
               </div>

             {userId ? (
                <div className="rounded-full bg-[#212121] h-10 w-10">
               <Image src='/assets/user5.png' width={24} height={24} alt='user' className='size-full'/>
               
               </div>
             ): (

                <Link href='/sign-in'>
                          <button className="text-center w-42 h-11 rounded-md bg-[#ffffff33] text-white-100 font-semibold text-[18px] cursor-pointer" 
                         ><p className="text-[15px] font-semibold text-[#f1f1f1] whitespace-nowrap shrink-0">Create an Account</p>
                         </button>
                       </Link> 
             )}
            </div>
       </div>
          )}
              </>
    
  )
}

export default Header

