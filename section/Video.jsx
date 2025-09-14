import {useGetUserByIdQuery} from "@/features/user/userApiSlice"
import { daysAgo } from "@/utils"
import Image from "next/image"
import Link from "next/link"
import {useAuth} from '@/hooks/useAuth'

const Video = ({video}) => {

 const {data} = useGetUserByIdQuery({userId: video.userId})

  const {undefined} = data?.entities || {}

  return (
     <Link href={`/video/${video._id}`} key={video._id}>
             <div className='flex flex-col gap-3 mb-4 lg:mb-6'>
               <div className="h-[16rem] bg-[#ffffff33] rounded-xl">
                <Image src={video.thumbnailUrl?.cloudinaryUrl} width={500} height={500} alt='like' className='h-full w-full object-cover rounded-xl'/>
            </div>
               
               <div className='flex items-start  gap-3'>
    
                  <div className='w-12 h-12 rounded-full bg-[#ffffff33] whitespace-nowrap shrink-0'>
                    <Image src='/assets/user5.png' width={24} height={24} alt='like' className='size-full'/>
                  </div>
                     <div className='flex flex-col leading-0 gap-4'>
                         <p className='text-[18px] text-[#f1f1f1] font-medium leading-6 text-wrap font-sans'>{video.title}</p>
                           <div className='flex flex-col gap-6'>
                               <p className='text-[16px] text-white/50'>{undefined?.user?.username}</p>
                         <div className='flex items-center gap-2'>
                         <p className='text-[16px] text-white/50'>504K<span className='text-[15px]'> views</span></p>
                         <p className='text-[14px] text-white/50'>{daysAgo(video.createdAt)}</p>
                         </div>
                           </div>
                         
                     </div>
               </div>
              </div>
              </Link>
  )
}

export default Video