'use client'
import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

const VideoCarousel = () => {

    const categories = [
    { label: 'All' },
    { label: 'Ai' },
    { label: 'Economics' },
    { label: 'Technology' },
    { label: 'Javascript' },
    { label: 'Music' },
    { label: 'Art' },
    { label: 'Money' },
    { label: 'Recently Uploaded' },
    { label: 'Podcast' },
    { label: 'Sport entertainment' },
    { label: 'Science' },
    { label: 'Technology' },
    { label: 'Millioniares' },
    { label: 'Nollywood' },
    { label: 'Bollywood' },
    { label: 'Intelligence' },
    { label: 'Science' },
    { label: 'Wild life' },
    { label: 'Watched' },
  ];

     

  const TRANSLATE_AMOUNT = 1000; // Reduced for better mobile experience
  const [translate, setTranslate] = useState(0);
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [isRightVisible, setIsRightVisible] = useState(true);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [clicked, setClicked] = useState('All') 

  // Update visibility of navigation buttons
  const updateArrowVisibility = useCallback(() => {
    if (containerRef.current && contentRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const contentWidth = contentRef.current.scrollWidth;
      
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
        const containerWidth = containerRef.current.clientWidth;
        const contentWidth = contentRef.current.scrollWidth;
        
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
        const containerWidth = containerRef.current.clientWidth;
        const contentWidth = contentRef.current.scrollWidth;
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
     <div className="flex items-center relative overflow-x-hidden">
<div 
        ref={containerRef}
        className='relative w-full max-w-[90vw] mx-auto'
      >
        {/* Left arrow */}
        {isLeftVisible && (
          <button
            onClick={scrollLeft}
            className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-700/90 text-white rounded-md transition-all py-[8px] px-4 bg-[#000000] cursor-pointer'
            aria-label='Scroll left'
          >
            &lt;
          </button>
        )}

        {/* Categories */}
        <div 
          ref={contentRef}
          className='flex overflow-hidden scroll-smooth w-full'
        >
          <div 
            className='flex gap-4 transition-transform duration-300 whitespace-nowra py-2 braek-all'
            style={{ transform: `translateX(-${translate}px)` }}
          >
            {categories.map((cat, index) => (
              <div
               key={index}
                className= 'cursor-pointer flex-shrink-0 h-fit w-[340px] transition-colors border-none outline-none break-all'
              >
               <div className='flex flex-col gap-3 sm:mb-2 lg:mb-6'>
                                   <div className="h-[16rem] bg-[#ffffff33] rounded-xl">
                                      <Image src='/assets/robot.png' width={500} height={500} alt='like' className='h-full w-full object-cover rounded-xl'/>
                                </div>
                                   
                                   <div className='flex items-start  gap-3'>
                        
                                      <div className='w-12 h-12 rounded-full bg-[#ffffff33] whitespace-nowrap shrink-0'>
                                        <Image src='/assets/user5.png' width={24} height={24} alt='like' className='size-full'/>
                                      </div>
                                         <div className='flex flex-col leading-0 gap-4'>
                                             <p className='text-[15px] text-[#f1f1f1] font-medium leading-6 text-wrap font-sans'>Not just free but also powerful! Use all the paid plan features for free.</p>
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
              </div>
            ))}
          </div>
        </div>

        {/* Right arrow */}
        {isRightVisible && (
          <button
            onClick={scrollRight}
            className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-700/90 text-white rounded-md transition-all py-[8px] px-4 bg-[#000000] cursor-pointer'
            aria-label='Scroll right'
          >
            &gt;
          </button>
        )}
      </div>
        </div>
  )
}

export default VideoCarousel