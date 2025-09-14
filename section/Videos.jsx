'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {useGetVideoQuery} from '@/features/video/videoApiSlice'
import { daysAgo } from '@/utils'
import Video from '@/section/Video'

const Videos = ({category}) => {

   const {data} = useGetVideoQuery({ category })

   const {ids, entities} = data || {}

  return (
    <div className='py-5 gap-3 grid xl:gap-4 sm:grid-cols-[repeat(auto-fill,minmax(360px,1fr))] px-5 2xl:px-0'
    >
        {/* Begin */}
           {ids?.length > 0 ? ids.map((id) => {
             const video = entities[id]
             return (
                <Video video={video} key={video.id}/>
             )
           }) : ''}
          {/* End */}

        {/* Begin */}
        <Link href={`/video/123`}>
         <div className='flex flex-col gap-3 sm:mb-2 lg:mb-6'>
           <div className="h-[16rem] bg-[#ffffff33] rounded-xl">
            <Image src='/assets/auth.png' width={500} height={500} alt='like' className='h-full w-full object-cover rounded-xl'/>

        </div>
           
           <div className='flex items-start  gap-3'>

              <div className='w-12 h-12 rounded-full bg-[#ffffff33] whitespace-nowrap shrink-0'>
                <Image src='/assets/user5.png' width={24} height={24} alt='like' className='size-full'/>
              </div>
                 <div className='flex flex-col leading-0 gap-4'>
                     <p className='text-[18px] text-[#f1f1f1] font-medium leading-6 text-wrap font-sans'>Not just free but also powerful! Use all the paid plan features for free.</p>
                       <div className='flex flex-col gap-6'>
                           <p className='text-[16px] text-white/50'>TrulyVisual</p>
                     <div className='flex items-center gap-2'>
                     <p className='text-[16px] text-white/50'>504K<span className='text-[15px]'> views</span></p>
                     <p className='text-[14px] text-white/50'>4 Month ago</p>
                     </div>
                       </div>
                     
                 </div>
           </div>
          </div>
          </Link>
          {/* End */}
                         
        {/* Begin */}
         <div className='flex flex-col gap-3 sm:mb-2 lg:mb-6'>
           <div className="h-[16rem] bg-[#ffffff33] rounded-xl">
              <Image src='/assets/robot.png' width={500} height={500} alt='like' className='h-full w-full object-cover rounded-xl'/>
        </div>
           
           <div className='flex items-start  gap-3'>

              <div className='w-12 h-12 rounded-full bg-[#ffffff33] whitespace-nowrap shrink-0'>
                <Image src='/assets/user5.png' width={24} height={24} alt='like' className='size-full'/>
              </div>
                 <div className='flex flex-col leading-0 gap-4'>
                     <p className='text-[18px] text-[#f1f1f1] font-medium leading-6 text-wrap font-sans'>Not just free but also powerful! Use all the paid plan features for free.</p>
                       <div className='flex flex-col gap-6'>
                           <p className='text-[16px] text-white/50'>TrulyVisual</p>
                     <div className='flex items-center gap-2'>
                     <p className='text-[16px] text-white/50'>504K<span className='text-[15px]'> views</span></p>
                     <p className='text-[14px] text-white/50'>4 Month ago</p>
                     </div>
                       </div>
                     
                 </div>
           </div>
          </div>
          {/* End */}
        {/* Begin */}
         <div className='flex flex-col gap-3 sm:mb-2 lg:mb-6'>
           <div className="h-[16rem] bg-[#ffffff33] rounded-xl">
              <Image src='/assets/ed-tech1.png' width={500} height={500} alt='like' className='h-full w-full object-cover rounded-xl'/>
        </div>
           
           <div className='flex items-start  gap-3'>

              <div className='w-12 h-12 rounded-full bg-[#ffffff33] whitespace-nowrap shrink-0'>
                <Image src='/assets/user5.png' width={24} height={24} alt='like' className='size-full'/>
              </div>
                 <div className='flex flex-col leading-0 gap-4'>
                     <p className='text-[18px] text-[#f1f1f1] font-medium leading-6 text-wrap font-sans'>Not just free but also powerful! Use all the paid plan features for free.</p>
                       <div className='flex flex-col gap-6'>
                           <p className='text-[16px] text-white/50'>TrulyVisual</p>
                     <div className='flex items-center gap-2'>
                     <p className='text-[16px] text-white/50'>504K<span className='text-[15px]'> views</span></p>
                     <p className='text-[14px] text-white/50'>4 Month ago</p>
                     </div>
                       </div>
                     
                 </div>
           </div>
          </div>
          {/* End */}
        {/* Begin */}
         <div className='flex flex-col gap-3 sm:mb-2 lg:mb-6'>
           <div className="h-[16rem] bg-[#ffffff33] rounded-xl">
              <Image src='/assets/robot.png' width={500} height={500} alt='like' className='h-full w-full object-cover rounded-xl'/>
          </div>
           
           <div className='flex items-start  gap-3'>

              <div className='w-12 h-12 rounded-full bg-[#ffffff33] whitespace-nowrap shrink-0'>
                <Image src='/assets/user5.png' width={24} height={24} alt='like' className='size-full'/>
              </div>
                 <div className='flex flex-col leading-0 gap-4'>
                     <p className='text-[18px] text-[#f1f1f1] font-medium leading-6 text-wrap font-sans'>Not just free but also powerful! Use all the paid plan features for free.</p>
                       <div className='flex flex-col gap-6'>
                           <p className='text-[16px] text-white/50'>TrulyVisual</p>
                     <div className='flex items-center gap-2'>
                     <p className='text-[16px] text-white/50'>504K<span className='text-[15px]'> views</span></p>
                     <p className='text-[14px] text-white/50'>4 Month ago</p>
                     </div>
                       </div>
                     
                 </div>
           </div>
          </div>
          {/* End */}
        {/* Begin */}
         <div className='flex flex-col gap-3 sm:mb-2 lg:mb-6'>
           <div className="h-[16rem] bg-[#ffffff33] rounded-xl">
              <Image src='/assets/auth.png' width={500} height={500} alt='like' className='h-full w-full object-cover rounded-xl'/>
        </div>
           
           <div className='flex items-start  gap-3'>

              <div className='w-12 h-12 rounded-full bg-[#ffffff33] whitespace-nowrap shrink-0'>
                <Image src='/assets/user5.png' width={24} height={24} alt='like' className='size-full'/>
              </div>
                 <div className='flex flex-col leading-0 gap-4'>
                     <p className='text-[18px] text-[#f1f1f1] font-medium leading-6 text-wrap font-sans'>Not just free but also powerful! Use all the paid plan features for free.</p>
                       <div className='flex flex-col gap-6'>
                           <p className='text-[16px] text-white/50'>TrulyVisual</p>
                     <div className='flex items-center gap-2'>
                     <p className='text-[16px] text-white/50'>504K<span className='text-[15px]'> views</span></p>
                     <p className='text-[14px] text-white/50'>4 Month ago</p>
                     </div>
                       </div>
                     
                 </div>
           </div>
          </div>
          {/* End */}
        {/* Begin */}
         <div className='flex flex-col gap-3 sm:mb-2 lg:mb-6'>
           <div className="h-[16rem] bg-[#ffffff33] rounded-xl">
              <Image src='/assets/ed-tech1.png' width={500} height={500} alt='like' className='h-full w-full object-cover rounded-xl'/>
        </div>
           
           <div className='flex items-start  gap-3'>

              <div className='w-12 h-12 rounded-full bg-[#ffffff33] whitespace-nowrap shrink-0'>
                <Image src='/assets/user5.png' width={24} height={24} alt='like' className='size-full'/>
              </div>
                 <div className='flex flex-col leading-0 gap-4'>
                     <p className='text-[18px] text-[#f1f1f1] font-medium leading-6 text-wrap font-sans'>Not just free but also powerful! Use all the paid plan features for free.</p>
                       <div className='flex flex-col gap-6'>
                           <p className='text-[16px] text-white/50'>TrulyVisual</p>
                     <div className='flex items-center gap-2'>
                     <p className='text-[16px] text-white/50'>504K<span className='text-[15px]'> views</span></p>
                     <p className='text-[14px] text-white/50'>4 Month ago</p>
                     </div>
                       </div>
                     
                 </div>
           </div>
          </div>
          {/* End */}
        {/* Begin */}
         <div className='flex flex-col gap-3 sm:mb-2 lg:mb-6'>
           <div className="h-[16rem] bg-[#ffffff33] rounded-xl">
              <Image src='/assets/robot.png' width={500} height={500} alt='like' className='h-full w-full object-cover rounded-xl'/>
        </div>
           
           <div className='flex items-start  gap-3'>

              <div className='w-12 h-12 rounded-full bg-[#ffffff33] whitespace-nowrap shrink-0'>
                <Image src='/assets/user5.png' width={24} height={24} alt='like' className='size-full'/>
              </div>
                 <div className='flex flex-col leading-0 gap-4'>
                     <p className='text-[18px] text-[#f1f1f1] font-medium leading-6 text-wrap font-sans'>Not just free but also powerful! Use all the paid plan features for free.</p>
                       <div className='flex flex-col gap-6'>
                           <p className='text-[16px] text-white/50'>TrulyVisual</p>
                     <div className='flex items-center gap-2'>
                     <p className='text-[16px] text-white/50'>504K<span className='text-[15px]'> views</span></p>
                     <p className='text-[14px] text-white/50'>4 Month ago</p>
                     </div>
                       </div>
                     
                 </div>
           </div>
          </div>
          {/* End */}
        {/* Begin */}
         <div className='flex flex-col gap-3 sm:mb-2 lg:mb-6'>
           <div className="h-[16rem] bg-[#ffffff33] rounded-xl">
              <Image src='/assets/ed-tech1.png' width={500} height={500} alt='like' className='h-full w-full object-cover rounded-xl'/>
        </div>
           
           <div className='flex items-start  gap-3'>

              <div className='w-12 h-12 rounded-full bg-[#ffffff33] whitespace-nowrap shrink-0'>
                <Image src='/assets/user5.png' width={24} height={24} alt='like' className='size-full'/>
              </div>
                 <div className='flex flex-col leading-0 gap-4'>
                     <p className='text-[18px] text-[#f1f1f1] font-medium leading-6 text-wrap font-sans'>Not just free but also powerful! Use all the paid plan features for free.</p>
                       <div className='flex flex-col gap-6'>
                           <p className='text-[16px] text-white/50'>TrulyVisual</p>
                     <div className='flex items-center gap-2'>
                     <p className='text-[16px] text-white/50'>504K<span className='text-[15px]'> views</span></p>
                     <p className='text-[14px] text-white/50'>4 Month ago</p>
                     </div>
                       </div>
                     
                 </div>
           </div>
          </div>
          {/* End */}
        {/* Begin */}
         <div className='flex flex-col gap-3 sm:mb-2 lg:mb-6'>
           <div className="h-[16rem] bg-[#ffffff33] rounded-xl">
              <Image src='/assets/robot.png' width={500} height={500} alt='like' className='h-full w-full object-cover rounded-xl'/>
             
        </div>
           
           <div className='flex items-start  gap-3'>

              <div className='w-12 h-12 rounded-full bg-[#ffffff33] whitespace-nowrap shrink-0'>
                <Image src='/assets/user5.png' width={24} height={24} alt='like' className='size-full'/>
              </div>
                 <div className='flex flex-col leading-0 gap-4'>
                     <p className='text-[18px] text-[#f1f1f1] font-medium leading-6 text-wrap font-sans'>Not just free but also powerful! Use all the paid plan features for free.</p>
                       <div className='flex flex-col gap-6'>
                           <p className='text-[16px] text-white/50'>TrulyVisual</p>
                     <div className='flex items-center gap-2'>
                     <p className='text-[16px] text-white/50'>504K<span className='text-[15px]'> views</span></p>
                     <p className='text-[14px] text-white/50'>4 Month ago</p>
                     </div>
                       </div>
                     
                 </div>
           </div>
          </div>
          {/* End */}
        {/* Begin */}
         <div className='flex flex-col gap-3 sm:mb-2 lg:mb-6'>
           <div className="h-[16rem] bg-[#ffffff33] rounded-xl">
              <Image src='/assets/auth.png' width={500} height={500} alt='like' className='h-full w-full object-cover rounded-xl'/>
        </div>
           
           <div className='flex items-start  gap-3'>

              <div className='w-12 h-12 rounded-full bg-[#ffffff33] whitespace-nowrap shrink-0'>
                <Image src='/assets/user5.png' width={24} height={24} alt='like' className='size-full'/>
              </div>
                 <div className='flex flex-col leading-0 gap-4'>
                     <p className='text-[18px] text-[#f1f1f1] font-medium leading-6 text-wrap font-sans'>Not just free but also powerful! Use all the paid plan features for free.</p>
                       <div className='flex flex-col gap-6'>
                           <p className='text-[16px] text-white/50'>TrulyVisual</p>
                     <div className='flex items-center gap-2'>
                     <p className='text-[16px] text-white/50'>504K<span className='text-[15px]'> views</span></p>
                     <p className='text-[14px] text-white/50 '>4 Month ago</p>
                     </div>
                       </div>
                     
                 </div>
           </div>
          </div>
          {/* End */}
       </div>
  )
}

export default Videos