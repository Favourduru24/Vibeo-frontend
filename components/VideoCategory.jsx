import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { daysAgo } from "@/utils"


const VideoCategory = ({video}) => {
  return (
     <Link href={`/video/${video._id}`} key={video._id}>
    <div className='flex gap-2 leading-4 '>
                                <div className='min-w-32 h-24 rounded-lg bg-gray-100'>
                                    <Image src={video.thumbnailUrl?.cloudinaryUrl} width={500} height={500} alt='like' className='h-full w-full object-cover rounded-xl'/>
                                </div>
                                <div className='flex flex-col w-full'>
                                     <div className='flex items-start w-full justify-between gap-2'>
                                        <p className='text-[13px] 2xl:text-[14px] capitalize text-white-100 trauncate font-semibold p-0'>{video.title}</p>
                                        <div className='h-fit w-fit flex justify-center whitespace-nowrap'>
                                        <Image src='/assets/icons/more.png' width={24} height={24} alt='like' className='size-5 cursor-pointer object-cover'/>
                                        </div>
                                    </div>
                                        <div className='flex flex-col mt-1 gap-1'>
                                                        <p className='text-[13px] text-white/50'>TrulyVisual</p>
                                                        <div className='flex sm:flex-row xl:flex-col 2xl:flex-row gap-2'>
                                                        <p className='text-[13px] text-white/50'>504K<span className='text-[15px]'> views</span></p>
                                                        <p className='text-[11px] text-white/50'>{daysAgo(video.createdAt)}</p>
                                                        </div>
                                                         </div>
                                         </div>
                                </div>
                                </Link>
  )
}

export default VideoCategory