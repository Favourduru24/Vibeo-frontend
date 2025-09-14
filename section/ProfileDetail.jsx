import VideoCarousel from '@/components/VideoCarousel'
import Image from 'next/image'
import Link from 'next/link'

const ProfileDetail = () => {

   const profileRoute = [
        {
         label: 'Home',
         href:'/profile/record' 
        },
        {
         label: 'Video',
         href:'/profile/video' 
        },
        {
         label: 'Records',
         href:'/profile/records' 
        }
]

  return (
    <div className='flex flex-col w-full py-5 px-5 2xl:px-0 gap-8 justify-center'>
       <div className='w-full h-52 rounded-lg border-2 border-gray-100'>
         <Image src='/assets/auth.png' width={500} height={500} alt='like' className='h-full w-full object-cover rounded-xl'/>
       </div>
        <div className='flex gap-4 items-center'>
          <div className='w-48 h-48 rounded-full bg-[#ffffff33] whitespace-nowrap shrink-0'>
            <Image src='/assets/user5.png' width={24} height={24} alt='like' className='size-full'/>
            </div>
          <div className='flex flex-col gap-2'>•
            <p className='text-4xl text-white-100 font-semibold font-sans'>Codesistency</p>
            <p className='text-lg text-white-100 font-semibold font-sans'>@codesistency <span className='text-[14px] text-white/50'>• 100K subscribers • 28 videos</span></p>
            <p className='text-[17px] text-white/50 font-sans leading-6 max-w-2xl'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab reiciendis, autem....more</p>
            <button className="w-28 h-9 rounded-full bg-white-100 text-[#000000] font-semibold text-[15px] cursor-pointer mt-2 font-sans">
                    Subscribe
                  </button>
          </div>
        </div>
         
         <div className='flex gap-6 items-center mt-10  h-8'>
           <div className='flex gap-6 items-center mt-10  h-8'>
             {profileRoute.map((route, index) => (
                <Link href={route.href} key={index}>
                <button className='text-[1rem] text-black-100 font-semibold h-full bg-white-100 p-2 items-center flex rounded-md cursor-pointer'>{route.label}</button>
                </Link>
             ))}
         </div>
         </div>
            <p className='text-2xl text-white-100 font-semibold font-sans leading-0'>Video for you</p>
          <VideoCarousel />

            <p className='text-2xl text-white-100 font-semibold font-sans leading-0'>Records for you</p>
          <VideoCarousel />
     
         
    </div>
  )
}

export default ProfileDetail