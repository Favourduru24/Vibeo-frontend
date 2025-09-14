'use client'
import Category from '@/components/Category'
import ShortCategory from '@/components/ShortCarousel'
import VideoCustomPlayer from '@/components/VideoCustomPlayer'
import {useGetRecordedVideoByIdQuery, useLikeRecordedVideoMutation, useUnlikeRecordedVideoMutation, useSaveScreenRecordMutation } from '@/features/recorded-video/recordedVideoApiSlice'
import {useSaveNewVideoMutation} from '@/features/save-video/saveVideoApiSlice'
import useAuth from '@/hooks/useAuth'
import Image from 'next/image'
import { useAddSubcriberMutation, useRemoveSubcriberMutation, useGetUserByIdQuery } from '@/features/user/userApiSlice'

const RecordDetail = ({id}) => {

     const {id: userId} = useAuth()
     const {data} = useGetRecordedVideoByIdQuery(id)
     const [likeVideo, {isLoading}] = useLikeRecordedVideoMutation(id)
     const [unlikeVideo, {isLoading: unLikeLoading}] = useUnlikeRecordedVideoMutation(id)
     const [saveVideo, {isLoading: saveLoading}] = useSaveNewVideoMutation()
     const [addSubscriber, {isLoading: addSubcriberLoading}] = useAddSubcriberMutation()
     const [removeSubsriber, {isLoading: removeSubcriberLoading}] = useRemoveSubcriberMutation()
    //  const {data: getUserData} = useGetUserByIdQuery({user: userId})

     const {ids = [], entities = {}} = data || {}

     const video = entities[id]

     
     console.log({id, data})

     const handleLikeVideo = async (e) => {
         e.preventDefault()
         await likeVideo({userId, id})
     }

     const handleUnlikeVideo = async (e) => {
      e.preventDefault()
         await unlikeVideo({userId, id})
     }

    const handleSaveVideo = async (e) => {
        e.preventDefault()
        await saveVideo({id, userId})
    }
   
    // const handleAddSubscriber = async (e) => {
    //   e.preventDefault()
    //      await unlikeVideo({user: userId})
    //  }

    //  const handleRemoveSubscriber = async (e) => {
    //   e.preventDefault()
    //      await unlikeVideo({user: userId})
    //  }
    

  return (
    <div className='flex w-full gap-4 py- sm:pb-5'>
       <div className='w-[75%] rounded-lg h-full bg-black-100 min-h-screen mt-2 flex flex-col px-2'>
       <VideoCustomPlayer videoUrl={video?.videoUrl?.cloudinaryUrl}/>

          {/* Begin */}
        <div className='h-32 bg-gradient-to-b from-[#ffffff33] to-[#000000] w-full p- flex flex-col gap-5 p-1'>
            <p className='text-[24px] text-[#f1f1f1] font-medium leading-6 text-wrap font-sans mt-2'>{video?.title}.</p>
            <div className='w-full flex items-center justify-between'>
              <div className='flex items-center gap-6'>
                  <div className='flex items-center  gap-3'>
                                <div className='w-13 h-13 rounded-full bg-[#ffffff33] whitespace-nowrap shrink-0'>
                                  <Image src='/assets/user5.png' width={24} height={24} alt='like' className='size-full'/>
                                </div>
                                   <div className='flex flex-col leading-0 gap-4'>
                                       <p className='text-[18px] text-[#f1f1f1] font-medium leading-4 text-wrap font-sans'>JB WEBDEVELOPER</p>
                                         <p className='text-[14px] text-white/50'>12k subscriber</p>
                                   </div>
                             </div>
                   <button className="w-28 h-9 rounded-full bg-white-100 text-[#000000] font-semibold text-[15px] cursor-pointer">
                    Subscribe
                  </button>
                   {/* <button className="w-fit h-9 rounded-full bg-white-100 text-[#000000] font-semibold text-[15px] cursor-pointer" onClick={handleRemoveSubscriber}>
                    removeSubscriber
                  </button> */}

              </div>
              <div className='flex items-center gap-3'>
                                     <div className='flex items-center'>
                                   <div className='bg-[#212121] rounded-l-full border-r-gray-100 border-r-[0.5px] h-10 w-fit flex items-center justify-center cursor-pointer gap-2 px-3 py-1'>
                                  <Image src='/assets/like.png' width={24} height={24} alt='like' className='size-5' onClick={!video?.likes.includes(userId) ? handleLikeVideo : undefined}/>
                                   {/* <Image src='/assets/like.png' width={24} height={24} alt='like' className='size-5'/> */}
                                  {/* <p className='text-[14px] text-white-100'>45</p> */}
                                  <p className='text-[14px] text-white-100'>{video?.likes.length}</p>
                               </div>
                                   <div className='bg-[#212121] rounded-r-full h-10 w-fit flex items-center justify-center cursor-pointer gap-2 px-3 py-1'>
                                  <Image src='/assets/like.png' width={24} height={24} alt='like' className='size-5' onClick={video?.likes.includes(userId) ? handleUnlikeVideo : undefined}/>
                               </div>
                                     </div>
                               
                <div className='bg-[#212121] rounded-full h-10 w-fit flex items-center justify-center cursor-pointer gap-2 px-3 '>
                                  <Image src='/assets/share.png' width={24} height={24} alt='like' className='size-5'/>
                                  <p className='text-[14px] text-white-100'>Share</p>
                               </div>
                <div className='bg-[#212121] rounded-full h-10 w-fit flex items-center justify-center cursor-pointer gap-2 px-3 '>
                                  <Image src='/assets/save.png' width={24} height={24} alt='like' className='size-5' onClick={handleSaveVideo}/>
                                  <p className='text-[14px] text-white-100'>Save</p>
                               </div>
                <div className='bg-[#212121] rounded-full h-10 w-fit flex items-center justify-center cursor-pointer gap-2 px-3 py-1'>
                                  <Image src='/assets/like.png' width={24} height={24} alt='like' className='size-5'/>
                                  <p className='text-[14px] text-white-100'>Download</p>
                               </div>
              </div>
            </div>
        </div>
        {/* End */}
       <div className='h-24 bg-gray-100 w-full p- flex flex-col gap-2 p-2 rounded-xl'>
                     <div className='flex items-center gap-2'>
                     <p className='text-[14px] text-white-100 font-semibold'>1.6K<span className='text-[15px]'> views</span></p>
                     <p className='text-[14px] text-white-100 font-semibold'>1 Month ago</p>
                     </div>
                         {/* Todo Md mark-down */}
                       <div className='flex-col gap-2'>
                     <p className='text-[14px] capitalize text-white-100 trauncate font-semibold p-0 '>Once you learn this lesson you will never be the same</p>
                     <p className='text-[14px] text-white-100 trauncate font-semibold p-0 '>STARTER KIT: <span className='text-blue-500 text-[13px] lowercase font-semibold'>https://jasdfjzsufgzjfvcgoogle.com/ </span> {'  '}....more</p>
                       </div>
       </div>
           
            <div className='mt-7 flex flex-col gap-6'>
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
                                            <div className='w-12 h-12 rounded-full bg-[#ffffff33] whitespace-nowrap shrink-0'>
                                              <Image src='/assets/user5.png' width={24} height={24} alt='like' className='size-full'/>
                                            </div>
                                               <div className='flex flex-col'>
                                                   <p className='text-[13px] text-white-100'>@durupristine@gmail.com<span className='text-[14px] text-white/50'> 1 week ago</span></p>
                                                     <div className='flex flex-col'>
                                                         <p className='text-[15px] text-white-100 leading-6 max-w-4xl text-wrap break-all'>This content is very useful thank for sharing this is nice This content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is nice.</p>
                                                     </div>

                                                     <div className='flex items-center gap-2'>
                                   <div className='h-10 w-fit flex items-center justify-center gap-2 '>
                                  <Image src='/assets/like.png' width={24} height={24} alt='like' className='size-4 cursor-pointer'/>
                                  <p className='text-[11px] text-white/50'>49k</p>
                               </div>
                                   <div className='h-10 w-fit flex items-center justify-center gap-2 '>
                                  <Image src='/assets/like.png' width={24} height={24} alt='like' className='size-4 cursor-pointer'/>
                               </div>
                                          </div>     
                                          <div className='flex items-center gap-2'>
                                          <div className='w-fit flex items-center justify-center gap-2 '>
                                         <Image src='/assets/arrow-down.png' width={24} height={24} alt='like' className='size-5 cursor-pointer'/>
                                         <p className='text-[13px] text-blue-500'>43 Reply</p>
                                        </div>
                                     </div>     
                                     </div>
                                      </div>
                                
                                     <div className='flex items-start gap-3'>
                                            <div className='w-12 h-12 rounded-full bg-[#ffffff33] whitespace-nowrap shrink-0'>
                                              <Image src='/assets/user5.png' width={24} height={24} alt='like' className='size-full'/>
                                            </div>
                                               <div className='flex flex-col'>
                                                   <p className='text-[13px] text-white-100'>@durupristine@gmail.com<span className='text-[14px] text-white/50'> 1 month ago</span></p>
                                                     <div className='flex flex-col'>
                                                         <p className='text-[15px] text-white-100 leading-6 max-w-4xl text-wrap break-all'>This content is very useful thank for sharing this is nice This content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is nice.</p>
                                                     </div>

                                                     <div className='flex items-center gap-2'>
                                   <div className='h-10 w-fit flex items-center justify-center gap-2 '>
                                  <Image src='/assets/like.png' width={24} height={24} alt='like' className='size-4 cursor-pointer'/>
                                  <p className='text-[11px] text-white/50'>49k</p>
                               </div>
                                   <div className='h-10 w-fit flex items-center justify-center gap-2 '>
                                  <Image src='/assets/like.png' width={24} height={24} alt='like' className='size-4 cursor-pointer'/>
                               </div>
                                          </div>     
                                          <div className='flex items-center gap-2'>
                                          <div className='w-fit flex items-center justify-center gap-2 '>
                                         <Image src='/assets/arrow-down.png' width={24} height={24} alt='like' className='size-5 cursor-pointer'/>
                                         <p className='text-[13px] text-blue-500'>93 Reply</p>
                                        </div>
                                     </div>     
                                     </div>
                                      </div>

                                      <div className='flex items-start gap-3'>
                                            <div className='w-12 h-12 rounded-full bg-[#ffffff33] whitespace-nowrap shrink-0'>
                                              <Image src='/assets/user5.png' width={24} height={24} alt='like' className='size-full'/>
                                            </div>
                                               <div className='flex flex-col'>
                                                   <p className='text-[13px] text-white-100'>@durupristine@gmail.com<span className='text-[14px] text-white/50'> 2 month ago</span></p>
                                                     <div className='flex flex-col'>
                                                         <p className='text-[15px] text-white-100 leading-6 max-w-4xl text-wrap break-all'>This content is very useful thank for sharing this is nice This content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is niceThis content is very useful thank for sharing this is nice.</p>
                                                     </div>

                                                     <div className='flex items-center gap-2'>
                                   <div className='h-10 w-fit flex items-center justify-center gap-2 '>
                                  <Image src='/assets/like.png' width={24} height={24} alt='like' className='size-4 cursor-pointer'/>
                                  <p className='text-[11px] text-white/50'>49k</p>
                               </div>
                                   <div className='h-10 w-fit flex items-center justify-center gap-2 '>
                                  <Image src='/assets/like.png' width={24} height={24} alt='like' className='size-4 cursor-pointer'/>
                               </div>
                                          </div>     
                                          <div className='flex items-center gap-2'>
                                          <div className='w-fit flex items-center justify-center gap-2 '>
                                         <Image src='/assets/arrow-down.png' width={24} height={24} alt='like' className='size-5 cursor-pointer'/>
                                         <p className='text-[13px] text-blue-500'>93 Reply</p>
                                        </div>
                                     </div>     
                                     </div>
                                      </div>
                          {/*Comment end*/}
                               </div>
                               

            </div>
       </div>
              
       <div className='w-[25%] m-h-[90vh] flex flex-col gap-2'>
            <Category/> 

               <ShortCategory />
              
              <div className='flex flex-col justify-center  p-2 rounded-xl w-full gap-2 mt-2'>
                {/* Begin */}
                 <div className='flex justify-center items-center gap-2 leading-4 '>
                 <div className='min-w-32 h-24 rounded-lg bg-gray-100'></div>
                  <div className='flex flex-col'>
                      <div className='flex gap-'>
                          <p className='text-[14px] capitalize text-white-100 trauncate font-semibold p-0 '>Once you learn this lesson you will never be the same</p>
                      </div>
                      <div className='flex flex-col mt-1 gap-1'>
                                           <p className='text-[13px] text-white/50'>TrulyVisual</p>
                                           <div className='flex items-center gap-2'>
                                           <p className='text-[13px] text-white/50'>504K<span className='text-[15px]'> views</span></p>
                                           <p className='text-[11px] text-white/50'>4 Month ago</p>
                                           </div>
                                             </div>
                  </div>
                 </div>
            {/* End */}
                {/* Begin */}
                 <div className='flex justify-center items-center gap-2 leading-4 '>
                 <div className='min-w-32 h-24 rounded-lg bg-gray-100'></div>
                  <div className='flex flex-col'>
                      <div className='flex gap-'>
                          <p className='text-[14px] capitalize text-white-100 trauncate font-semibold p-0 '>Once you learn this lesson you will never be the same</p>
                      </div>
                      <div className='flex flex-col mt-1 gap-1'>
                                           <p className='text-[13px] text-white/50'>TrulyVisual</p>
                                           <div className='flex items-center gap-2'>
                                           <p className='text-[13px] text-white/50'>504K<span className='text-[15px]'> views</span></p>
                                           <p className='text-[11px] text-white/50'>4 Month ago</p>
                                           </div>
                                             </div>
                  </div>
                 </div>
            {/* End */}
                {/* Begin */}
                 <div className='flex justify-center items-center gap-2 leading-4 '>
                 <div className='min-w-32 h-24 rounded-lg bg-gray-100'></div>
                  <div className='flex flex-col'>
                      <div className='flex gap-'>
                          <p className='text-[14px] capitalize text-white-100 trauncate font-semibold p-0 '>Once you learn this lesson you will never be the same</p>
                      </div>
                      <div className='flex flex-col mt-1 gap-1'>
                                           <p className='text-[13px] text-white/50'>TrulyVisual</p>
                                           <div className='flex items-center gap-2'>
                                           <p className='text-[13px] text-white/50'>504K<span className='text-[15px]'> views</span></p>
                                           <p className='text-[11px] text-white/50'>4 Month ago</p>
                                           </div>
                                             </div>
                  </div>
                 </div>
            {/* End */}
                {/* Begin */}
                 <div className='flex justify-center items-center gap-2 leading-4 '>
                 <div className='min-w-32 h-24 rounded-lg bg-gray-100'></div>
                  <div className='flex flex-col'>
                      <div className='flex gap-'>
                          <p className='text-[14px] capitalize text-white-100 trauncate font-semibold p-0 '>Once you learn this lesson you will never be the same</p>
                      </div>
                      <div className='flex flex-col mt-1 gap-1'>
                                           <p className='text-[13px] text-white/50'>TrulyVisual</p>
                                           <div className='flex items-center gap-2'>
                                           <p className='text-[13px] text-white/50'>504K<span className='text-[15px]'> views</span></p>
                                           <p className='text-[11px] text-white/50'>4 Month ago</p>
                                           </div>
                                             </div>
                  </div>
                 </div>
            {/* End */}
                {/* Begin */}
                 <div className='flex justify-center items-center gap-2 leading-4 '>
                 <div className='min-w-32 h-24 rounded-lg bg-gray-100'></div>
                  <div className='flex flex-col'>
                      <div className='flex gap-'>
                          <p className='text-[14px] capitalize text-white-100 trauncate font-semibold p-0 '>Once you learn this lesson you will never be the same</p>
                      </div>
                      <div className='flex flex-col mt-1 gap-1'>
                                           <p className='text-[13px] text-white/50'>TrulyVisual</p>
                                           <div className='flex items-center gap-2'>
                                           <p className='text-[13px] text-white/50'>504K<span className='text-[15px]'> views</span></p>
                                           <p className='text-[11px] text-white/50'>4 Month ago</p>
                                           </div>
                                             </div>
                  </div>
                 </div>
            {/* End */}
                {/* Begin */}
                 <div className='flex justify-center items-center gap-2 leading-4 '>
                 <div className='min-w-32 h-24 rounded-lg bg-gray-100'></div>
                  <div className='flex flex-col'>
                      <div className='flex gap-'>
                          <p className='text-[14px] capitalize text-white-100 trauncate font-semibold p-0 '>Once you learn this lesson you will never be the same</p>
                      </div>
                      <div className='flex flex-col mt-1 gap-1'>
                            <p className='text-[13px] text-white/50'>TrulyVisual</p>
                            <div className='flex items-center gap-2'>
                            <p className='text-[13px] text-white/50'>504K<span className='text-[15px]'> views</span></p>
                            <p className='text-[11px] text-white/50'>4 Month ago</p>
                            </div>
                    </div>
                  </div>
                 </div>
            {/* End */}
              </div>
       </div>
    </div>
  )
}

export default RecordDetail