'use client'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'


const Page = () => {

   const short = [
       {
         label: 'n',
       },
       {
         label: 'w',
       },
       {
         label: 'r',
       },
       {
         label: 'r',
       },
       {
         label: 'f',
       },
       {
         label: 'y',
       },
   ]

   const containerRef = useRef(null)
   const contentRef = useRef(null)
   const [translate, setTranslate] = useState(0)
   const TRANSLATE_AMOUNT = 800;
   const [clicked, setClicked] = useState('')
   const [isLeftVisible, setIsLeftVisible] = useState(false);
     const [isRightVisible, setIsRightVisible] = useState(true);
    const [open, setOpen] = useState(false)

   console.log(containerRef)


    const updateArrowVisibility = useCallback(() => {
       if (containerRef.current && contentRef.current) {
         const containerWidth = containerRef.current.clientHeight;
         const contentWidth = contentRef.current.scrollHeight;
         
         setIsLeftVisible(translate > 0);
         setIsRightVisible(translate + containerWidth < contentWidth);
       }
     }, [translate]);
   
     // Handle window resize
     useEffect(() => {
       const handleResize = () => {
         updateArrowVisibility();
         // Adjust translate if it goes beyond content after resize
         if (containerRef.current && contentRef.current) {
           const containerWidth = containerRef.current.clientHeight;
           const contentWidth = contentRef.current.scrollHeight;
           
           if (translate + containerWidth > contentWidth) {
             setTranslate(Math.max(0, contentWidth - containerWidth));
           }
         }
       };
   
       window.addEventListener('resize', handleResize);
       return () => window.removeEventListener('resize', handleResize);
     }, [translate, updateArrowVisibility]);
   
     // Initial visibility check
     useEffect(() => {
       updateArrowVisibility();
     }, [updateArrowVisibility]);

    const scrollLeft = useCallback(() => {
       setTranslate(prev => {
         const newTranslate = Math.max(0, prev - TRANSLATE_AMOUNT);
         return newTranslate;
       });
     }, []);
   
     const scrollRight = useCallback(() => {
       if (containerRef.current && contentRef.current) {
          setTranslate(prev => {
           console.log({prev})
           const containerWidth = containerRef.current.clientHeight;
           const contentWidth = contentRef.current.scrollHeight;
           console.log({containerWidth})
           console.log({ contentWidth})
           const maxTranslate = contentWidth - containerWidth;
           console.log({maxTranslate})
           const newTranslate = Math.min(maxTranslate, prev + TRANSLATE_AMOUNT);
         console.log({newTranslate})
           return newTranslate;
   
         });
       }
     }, []);

  return (
    <div className='text-white py-1 flex items-center justify-center relative'>
        <div className='flex flex-col gap-3 absolute right-0 top-1/2 -translate-y-1/2 z-10 items-center'>
          {isLeftVisible && (
          <button
            onClick={scrollLeft}
            className='bg-gray-800/80 hover:bg-gray-700/90 text-white rounded-md transition-all py-[8px] px-4 bg-[#000000] cursor-pointer'
            aria-label='Scroll left'//h-full
          >
            <Image src='/assets/arrow-down.png' width={24} height={24} alt='like' className='size-10 cursor-pointer rotate-180'/>
          </button>
        )}
      
                
          {isRightVisible && (
          <button
            onClick={scrollRight}
            className='bg-[#000000] hover:bg-gray-700/90 text-white py-[8px] px-4 rounded-md transition-all cursor-pointer'
            aria-label='Scroll right'
          >
            <Image src='/assets/arrow-down.png' width={24} height={24} alt='like' className='size-10 cursor-pointer'/>
          </button>
        )}
        </div>
       
      <div className='max-w-[1200px] w-full flex items-center rounded-xl gap-4 '>
         
           {<div 
          className='flex relative w-full rounded-lg overflow-hidden flex-col ' 
          ref={containerRef}
         
        >
            <div className='h-[50rem] relative w-full'>
                <div className='flex  overflow-hidden scroll-smooth w-full my-auto' ref={contentRef}>

                    <div 
            className='flex flex-col gap-3 transition-transform duration-300 w-full items-center max-w-6xl justify-center'
            style={{ transform: `translateY(-${translate}px)` }}
          >
              {short.map((cat, index) => (
                  <div 
                    className='flex gap-4 w-full relative justify-center h-[48rem]'
                    key={index}
                    >
                    
                <div className='flex w-full gap-3 max-w-xl justify-center'>
                <div
                key={`${cat.label}-${index}`}
                className='bg-gray-400 text-black-100 w-full h-[48rem] rounded-lg mt-3 border-b-1 border-b-white'
              >
                {cat.label}
              </div>

               <div className=' rounded-md flex flex-col gap-2 justify-end items-center mx-auto p-1'>
              <div className='flex flex-col gap-1 justify-center items-center'>
               <div className='bg-[#212121] rounded-full h-10 w-10 flex items-center justify-center cursor-pointer'>
                  <Image src='/assets/like.png' width={24} height={24} alt='like' className='size-5'/>
               </div>
               <p className='text-[14px] text-white-100'>1.7k</p>
              </div>
              <div className='flex flex-col gap-1 justify-center items-center'>
               <div className='bg-[#212121] rounded-full h-10 w-10 flex items-center justify-center cursor-pointer'>
                  <Image src='/assets/like.png' width={24} height={24} alt='like' className='size-5'/>

               </div>
               <p className='text-[14px] text-white-100'>Dislike</p>
              </div>
              <div className='flex flex-col gap-1 justify-center items-center'>
               <div className='bg-[#212121] rounded-full h-10 w-10 flex items-center justify-center cursor-pointer'>
                  <Image src='/assets/comment.png' width={24} height={24} alt='like' className='size-5'/>

               </div>
               <p className='text-[14px] text-white-100'>440</p>
              </div>
              <div className='flex flex-col gap-1 justify-center items-center'>
               <div className='bg-[#212121] rounded-full h-10 w-10 flex items-center justify-center cursor-pointer'>
                  <Image src='/assets/share.png' width={24} height={24} alt='like' className='size-5'/>
               </div>
               <p className='text-[14px] text-white-100'>Share</p>
              </div>
              <div className='flex flex-col gap-1 justify-center items-center'>
               <div className='bg-[#212121] rounded-full h-10 w-10 flex items-center justify-center cursor-pointer'>
                  <Image src='/vercel.svg' width={24} height={24} alt='like' className='size-5' onClick={() => setOpen((prev) => !prev)}/>
               </div>
               <p className='text-[14px] text-white-100'>Save</p>
              </div>
              <div className='bg-[#212121] rounded-sm h-10 w-10 flex items-center justify-center cursor-pointer'>
                  <Image src='/assets/user5.png' width={24} height={24} alt='user' className='size-full'/>
              </div>
              </div>
                </div>

                     <div>
                       <div className={`${open ? 'border-2' : 'border-none'}  border-gray-100 flex flex-col items-center my-auto max-w-xl  h-[52rem] mt-3 rounded-lg transform transition-width duration-100 ease-in ${
          open ? "w-full" : "w-0"
        }`}>   
                 {open && <div className='flex flex-col '>
                     <div className='flex flex-col h-[50rem]'>
                          <div className='border-b border-gray-600 py-3 px-4'>
                            <p className="text-lg font-semibold text-white">
                              Comments <span className='text-sm text-gray-400'>39</span>
                            </p> 
                          </div>
                          
                          <div className='flex-1 overflow-y-auto p-3 space-y-4'>
                            {[...Array(10)].map((_, i) => (
                              <div key={i} className='flex items-start gap-3'>
                                <div className='w-10 h-10 rounded-full bg-[#ffffff33] shrink-0'>
                                  <Image 
                                    src='/assets/user5.png' 
                                    width={40} 
                                    height={40} 
                                    alt='user' 
                                    className='size-full rounded-full'
                                  />
                                </div>
                                <div className='flex-1'>
                                  <p className='text-sm text-white'>
                                    @durupristine{i+1} <span className='text-xs text-gray-400'>1 week ago</span>
                                  </p>
                                  <p className='text-sm text-white mt-1'>
                                    This is a sample comment about the video content.
                                    This is a sample comment about the video content.
                                  </p>
                                  <div className='flex items-center gap-3 mt-2'>
                                    <div className='flex items-center gap-1'>
                                      <Image 
                                        src='/assets/like.png' 
                                        width={16} 
                                        height={16} 
                                        alt='like' 
                                        className='size-4'
                                      />
                                      <span className='text-xs text-gray-400'>49k</span>
                                    </div>
                                    <div className='flex items-center gap-1 text-xs text-blue-500'>
                                      <Image 
                                        src='/assets/arrow-down.png' 
                                        width={16} 
                                        height={16} 
                                        alt='replies' 
                                        className='size-4'
                                      />
                                      <span>43 Replies</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        </div>
                 }
                  
                   </div>
                     </div>
                     
                  

                </div>
            ))}  
          </div>
          
                </div>
            </div>
            
        
           </div> }

           
      </div>
    </div>
  )
}

export default Page
