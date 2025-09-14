'use client'
import Category from '@/components/Category'
import ShortCategory from '@/components/ShortCarousel'
import VideoCustomPlayer from '@/components/VideoCustomPlayer'
import {useGetVideoByIdQuery, useGetVideoQuery, useLikeVideoMutation, useUnlikeVideoMutation } from '@/features/video/videoApiSlice'
import useAuth from '@/hooks/useAuth'
import { useSaveNewVideoMutation } from '@/features/save-video/saveVideoApiSlice'
import { useAddSubcriberMutation, useRemoveSubcriberMutation, useGetUserByIdQuery} from '@/features/user/userApiSlice'
import VideoCategory from '@/components/VideoCategory'
import { daysAgo } from "@/utils"
import Image from 'next/image'
import {useEffect, useState, useRef} from 'react'

const VideoDetail = ({id, category}) => {
  // const {id: userId} = useAuth()
  const userId = '123'
  const {data} = useGetVideoByIdQuery(id)
  const {data: videoQuery} = useGetVideoQuery({category})
  const [likeVideo] = useLikeVideoMutation()
  const [unlikeVideo] = useUnlikeVideoMutation()
  const [saveVideo] = useSaveNewVideoMutation()
  const [addSubscriber] = useAddSubcriberMutation()
  const [removeSubsriber] = useRemoveSubcriberMutation()
  const [copy, setCopy] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const lastAction = useRef(null)

  const {entities = {}} = data || {}
  const {entities: videoEntities = {}, ids = {}} = videoQuery || {}
  const video = entities[id]
  const {data: user} = useGetUserByIdQuery({userId: video?.userId})
  const {undefined: userData} = user?.entities || {}

  // Like state management
  const [localLikeState, setLocalLikeState] = useState({
    isLiked: video?.likes?.includes(userId) || false,
    count: video?.likes?.length || 0
  });

  // Sync with server data
 const isProcessing = useRef(false);

  // Sync with server data
  useEffect(() => {
    setLocalLikeState({
      isLiked: video?.likes?.includes(userId) || false,
      count: video?.likes?.length || 0
    });
  }, [video, userId]);

  const handleLikeAction = async (action) => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    const newIsLiked = action === 'like';
    const countChange = newIsLiked ? 1 : -1;

    // Only update if state is actually changing
    if (localLikeState.isLiked !== newIsLiked) {
      setLocalLikeState(prev => ({
        isLiked: newIsLiked,
        count: Math.max(0, prev.count + countChange)
      }));

      try {
        const result = await (newIsLiked ? likeVideo : unlikeVideo)({ 
          userId, 
          id: video.id 
        }).unwrap();

        // Final sync with server
        if (result?.likes) {
          setLocalLikeState({
            isLiked: result.likes.includes(userId),
            count: result.likes.length
          });
        }
      } catch (error) {
        // Revert on error
        setLocalLikeState(prev => ({
          isLiked: !newIsLiked,
          count: Math.max(0, prev.count - countChange)
        }));
      }
    }
    
    isProcessing.current = false;
  };


  // Rest of your handlers remain the same
  const handleSaveVideo = async (e) => {
    e.preventDefault()
    await saveVideo({id, userId})
  }
  
  const handleAddSubscriber = async (e) => {
    e.preventDefault()
    await addSubscriber({user: userId})
  }

  const handleRemoveSubscriber = async (e) => {
    e.preventDefault()
    await removeSubsriber({user: userId})
  }

  const handleShareVideo = () => {
    navigator.clipboard.writeText(`${window.location.origin}/${id}`)
    setCopy(true)
    setTimeout(() => setCopy(false), 3000)
  }

  return (
    <>
      <div className='flex xl:flex-row flex-col w-full gap-4 py- sm:pb-5 '>
        {/* Left Column - Video Player */}
        <div className='xl:w-[75%] w-full rounded-lg h-full bg-black-100 min-h-screen mt-2 flex flex-col px-2 justify-center'>
          <VideoCustomPlayer videoUrl={`/assets/travel-tut.mp4`}/>

          {/* Video Info Section */}
          <div className='h-fit bg-gradient-to-b from-[#ffffff33] to-[#000000] w-full p- flex flex-col gap-5 p-1 mb-5'>
            <p className='text-[24px] text-[#f1f1f1] font-medium leading-6 text-wrap font-sans mt-2 leading-8'>
              {video?.title}This content is very useful thank for sharing this is nice This content is very useful.
            </p>
            
            <div className='w-full flex items-center justify-between'>
              <div className='flex items-center gap-6'>
                <div className='flex items-center gap-3'>
                  <div className='w-13 h-13 rounded-full bg-[#ffffff33] whitespace-nowrap shrink-0'>
                    <Image src='/assets/user5.png' width={24} height={24} alt='like' className='size-full'/>
                  </div>
                  <div className='flex flex-col leading-0 gap-4'>
                    <p className='text-[18px] text-[#f1f1f1] font-medium leading-4 text-wrap font-sans'>JB WEBDEVELOPER</p>
                    <p className='text-[14px] text-white/50'>{userData?.user?.subscription?.length} subscriber</p>
                  </div>
                </div>

                {userData?.user?.subscription?.includes(userId) ? (
                  <button 
                    className="w-28 h-9 rounded-full bg-white-100 text-[#000000] font-semibold text-[15px] cursor-pointer"
                    onClick={handleRemoveSubscriber}
                  >
                    UnSubscribe
                  </button>
                ) : (
                  <button 
                    className="w-28 h-9 rounded-full bg-white-100 text-[#000000] font-semibold text-[15px] cursor-pointer"
                    onClick={handleAddSubscriber}
                  >
                    Subscribe
                  </button> 
                )}
              </div>

              <div className='flex items-center gap-3'>
                <div className='flex items-center'>
                  <div className='bg-[#212121] rounded-l-full border-r-gray-100 border-r-[0.5px] h-10 w-fit flex items-center justify-center cursor-pointer gap-2 px-3 py-1'>
                    <Image 
                      src='/assets/icons/like.png' 
                      width={24} 
                      height={24} 
                      alt='like' 
                      className={`size-5 ${isPending && lastAction.current === 'like' ? 'opacity-50' : ''}`}
                      onClick={() => !isPending && handleLikeAction('like')}
                    />
                    <p className='text-[14px] text-white-100'>{localLikeState.count}</p>
                  </div>
                  <div className='bg-[#212121] rounded-r-full h-10 w-fit flex items-center justify-center cursor-pointer gap-2 px-3 py-1'>
                    <Image 
                      src='/assets/icons/like.png' 
                      width={24} 
                      height={24} 
                      alt='like' 
                      className={`size-5 ${isPending && lastAction.current === 'unlike' ? 'opacity-50' : ''}`}
                      onClick={() => !isPending && handleLikeAction('unlike')}
                    />
                  </div>
                </div>
                <div className='bg-[#212121] rounded-full h-10 w-fit flex items-center justify-center cursor-pointer gap-2 px-3 ' onClick={handleShareVideo}>
                                   <Image src='/assets/icons/share.png' width={24} height={24} alt='share' className='size-5'/>
                                   <p className='text-[14px] text-white-100'>{copy ? 'Shared' : 'Share'}</p>
                                </div>
                 <div className='bg-[#212121] rounded-full h-10 w-fit flex items-center justify-center cursor-pointer gap-2 px-3 '>
                                   <Image src='/assets/icons/save.png' width={24} height={24} alt='save' className='size-5' onClick={handleSaveVideo}/>
                                   <p className='text-[14px] text-white-100'>Save</p>
                                </div>
                 <div className='bg-[#212121] rounded-full h-10 w-fit flex items-center justify-center cursor-pointer gap-2 px-3 py-1'>
                                   <Image src='/assets/icons/like.png' width={24} height={24} alt='download' className='size-5'/>
                                   <p className='text-[14px] text-white-100'>Download</p>
                                </div>
              </div>
            </div>
          </div>

          {/* Video Stats */}
          <div className='h-24 bg-gray-100 w-full p- flex flex-col gap-2 p-2 rounded-xl'>
            <div className='flex items-center gap-2'>
              <p className='text-[14px] text-white-100 font-semibold'>1.6K<span className='text-[15px]'> views</span></p>
              <p className='text-[14px] text-white-100 font-semibold'>{daysAgo(video?.createdAt)}</p>
            </div>
            <div className='flex-col gap-2'>
              <p className='text-[13px] 2xl:text-[14px] capitalize text-white-100 trauncate font-semibold p-0 leading-5 '>Once you learn this lesson you will never be the same</p>
              <p className='text-[14px] text-white-100 trauncate font-semibold p-0 '>STARTER KIT: <span className='text-blue-500 text-[13px] lowercase font-semibold'>https://jasdfjzsufgzjfvcgoogle.com/ </span> {'  '}....more</p>
            </div>
          </div>

          {/* Comments Section */}
          <div className='mt-7 flex flex-col gap-6 justify-center px-2 py-4 md:p-0'>
            <p className='text-[20px] text-[#f1f1f1] font-medium leading-4 text-wrap font-sans'>9 Comments</p>
                  <div className='flex items-start gap-3'>
                 
                                <div className='w-12 h-12 rounded-full bg-[#ffffff33] whitespace-nowrap shrink-0'>
                                  <Image src='/assets/user5.png' width={24} height={24} alt='like' className='size-full'/>
                                </div>
                                   <div className='flex flex-col w-full'>
                                     <input type="text" className="outline-none w-full rounded-lg h-10 p-2 placeholder:text-white/50 text-[#f1f1f1] m-0 transition-all duration-500 placeholder:text-[15px]" placeholder="Add a comment..."/>  
                                       <div className='w-full h-[0.9px] bg-gray-100'/>
                                   </div>
                             </div>

                                <div className='flex flex-col gap-2'>
                           {/*Comment begin*/}
                               <div className='flex items-start gap-3'>
                                             <div className='w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#ffffff33] whitespace-nowrap shrink-0'>
                                               <Image src='/assets/user5.png' width={24} height={24} alt='like' className='size-full'/>
                                             </div>
                                                <div className='flex flex-col'>
                                                    <p className='text-[13px] text-white-100'>@durupristine@gmail.com<span className='text-[14px] text-white/50'> 1 week ago</span></p>
                                                      <div className='flex flex-col'>
                                                          <p className='md:text-[15px] text-[14px] text-white-100 leading-6 max-w-4xl text-wrap break-all font-sans'>This content is very useful thank for sharing this is nice This content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is.</p>
                                                      </div>

                                                      <div className='flex items-center gap-2'>
                                    <div className='h-10 w-fit flex items-center justify-center gap-2 '>
                                   <Image src='/assets/icons/like.png' width={24} height={24} alt='like' className='size-4 cursor-pointer'/>
                                   <p className='text-[11px] text-white/50'>49k</p>
                                </div>
                                    <div className='h-10 w-fit flex items-center justify-center gap-2 '>
                                   <Image src='/like.png' width={24} height={24} alt='like' className='size-4 cursor-pointer'/>
                                </div>
                                           </div>     
                                           <div className='flex items-center gap-2'>
                                           <div className='w-fit flex items-center justify-center gap-2 '>
                                          <Image src='/assets/icons/arrow-down.png' width={24} height={24} alt='like' className='size-5 cursor-pointer'/>
                                          <p className='text-[13px] text-blue-500'>43 Reply</p>
                                         </div>
                                      </div>     
                                      </div>
                                       </div>
                                
                                      <div className='flex items-start gap-3'>
                                             <div className='w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#ffffff33] whitespace-nowrap shrink-0'>
                                               <Image src='/assets/user5.png' width={24} height={24} alt='like' className='size-full'/>
                                             </div>
                                                <div className='flex flex-col'>
                                                    <p className='text-[13px] text-white-100'>@durupristine@gmail.com<span className='text-[14px] text-white/50'> 1 month ago</span></p>
                                                      <div className='flex flex-col'>
                                                          <p className='md:text-[15px] text-[14px] text-white-100 leading-6 max-w-4xl text-wrap break-all font-sans'>This content is very useful thank for sharing this is nice This content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is nice.</p>
                                                      </div>

                                                      <div className='flex items-center gap-2'>
                                    <div className='h-10 w-fit flex items-center justify-center gap-2 '>
                                   <Image src='/assets/icons/like.png' width={24} height={24} alt='like' className='size-4 cursor-pointer'/>
                                   <p className='text-[11px] text-white/50'>49k</p>
                                </div>
                                    <div className='h-10 w-fit flex items-center justify-center gap-2 '>
                                   <Image src='/assets/icons/like.png' width={24} height={24} alt='like' className='size-4 cursor-pointer'/>
                                </div>
                                           </div>     
                                           <div className='flex items-center gap-2'>
                                           <div className='w-fit flex items-center justify-center gap-2 '>
                                          <Image src='/assets/icons/arrow-down.png' width={24} height={24} alt='like' className='size-5 cursor-pointer'/>
                                          <p className='text-[13px] text-blue-500'>93 Reply</p>
                                         </div>
                                      </div>     
                                      </div>
                                       </div>

                                       <div className='flex items-start gap-3'>
                                             <div className='w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#ffffff33] whitespace-nowrap shrink-0'>
                                               <Image src='/assets/user5.png' width={24} height={24} alt='like' className='size-full'/>
                                             </div>
                                                <div className='flex flex-col'>
                                                    <p className='text-[13px] text-white-100'>@durupristine@gmail.com<span className='text-[14px] text-white/50'> 2 month ago</span></p>
                                                      <div className='flex flex-col'>
                                                          <p className='md:text-[15px] text-[14px] text-white-100 leading-6 max-w-4xl text-wrap break-all font-sans'>This content is very useful thank for sharing this is nice This content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is nice.</p>
                                                      </div>

                                                      <div className='flex items-center gap-2'>
                                    <div className='h-10 w-fit flex items-center justify-center gap-2 '>
                                   <Image src='/assets/icons/like.png' width={24} height={24} alt='like' className='size-4 cursor-pointer'/>
                                   <p className='text-[11px] text-white/50'>49k</p>
                                </div>
                                    <div className='h-10 w-fit flex items-center justify-center gap-2 '>
                                   <Image src='/assets/icons/like.png' width={24} height={24} alt='like' className='size-4 cursor-pointer'/>
                                </div>
                                           </div>     
                                           <div className='flex items-center gap-2'>
                                           <div className='w-fit flex items-center justify-center gap-2 '>
                                          <Image src='/assets/icons/arrow-down.png' width={24} height={24} alt='like' className='size-5 cursor-pointer'/>
                                          <p className='text-[13px] text-blue-500'>93 Reply</p>
                                         </div>
                                      </div>     
                                      </div>
                                       </div>
                           {/*Comment end*/}
                                </div>
          </div>
        </div>

        {/* Right Column - Suggestions */}
        <div className='w-full xl:w-[25%] m-h-[90vh] flex flex-col gap-2 '>
          <Category /> 
          <ShortCategory />
          <div className='flex flex-col sm:px-2 px-3 rounded-xl w-full gap-2 mt-2 pt-2'>
            {ids?.length > 0 ? ids.map((id) => {
              const video = videoEntities[id]
              return <VideoCategory video={video} key={video.id}/>
            }) : ''}
          </div>
        </div>
      </div>
    </>
  )
}

export default VideoDetail