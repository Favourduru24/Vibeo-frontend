'use client'
import { videoCategory } from '@/constants';
import { formUrlQuery, removeKeysFromQuery } from '@/utils';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter} from "next/navigation"


const Category = () => {

  const TRANSLATE_AMOUNT = 200; // Reduced for better mobile experience
  const [translate, setTranslate] = useState(0);
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [isRightVisible, setIsRightVisible] = useState(true);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [category, setCategory] = useState('All') 
  const router = useRouter()
  const searchParams = useSearchParams()

  // Update visibility of navigation buttons
  const updateArrowVisibility = useCallback(() => {
    if (containerRef.current && contentRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const contentWidth = contentRef.current.scrollWidth;
      
      setIsLeftVisible(translate > 0);
      setIsRightVisible(translate + containerWidth < contentWidth);
    }
  }, [translate]);

   const onSelectDuration = (category) => {
  let newUrl = ''
 if(category && category !== 'All') { //selectedDate && selectedDate !== 'Date Added'
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key:'category',
        value: category
     })
 } else{
  newUrl = removeKeysFromQuery({
    params: searchParams.toString(),
    keysToRemove:['category'],
 })
 }
   router.push(newUrl, {scroll: false})
}

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
        const containerWidth = containerRef.current.clientWidth;
        const contentWidth = contentRef.current.scrollWidth;
        const maxTranslate = contentWidth - containerWidth;
        const newTranslate = Math.min(maxTranslate, prev + TRANSLATE_AMOUNT);
        return newTranslate;

      });
    }
  }, []);

  return (
     <div className="flex items-center relative overflow-x-hidden z-[100px]">
<div 
        ref={containerRef}
        className='relative w-full max-w-[90vw] mx-auto'
      >
        {/* Left arrow */}
        {isLeftVisible && (
          <button
            onClick={scrollLeft}
            className='absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-gray-800/80 hover:bg-gray-800/90 text-white rounded-md transition-all py-[8px] px-4 bg-[#000000] cursor-pointer'
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
            className='flex gap-2 transition-transform duration-300 whitespace-nowra py-2'
            style={{ transform: `translateX(-${translate}px)` }}
          >
            {videoCategory.map((cat, index) => (
              <button
                value={category}
                onClick={() => {
                 onSelectDuration(cat.value)
                 setCategory(cat.value)
                }
              }
                key={cat.id}
                className={` ${category === cat.value ? 'bg-white-100 text-[#000000] ' : 'bg-[#ffffff33] text-white cursor-pointer'} flex-shrink-0 px-4 py-[7px] rounded-md text-[15px] transition-colors border-none outline-none font-semibold z-52`}
              >
                {cat.value}
              </button>
            ))}
          </div>
        </div>

        {/* Right arrow */}
        {isRightVisible && (
          <button
            onClick={scrollRight}
            className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-800/90 text-white rounded-md transition-all py-[8px] px-4 bg-[#000000] cursor-pointer'
            aria-label='Scroll right'
          >
            &gt;
          </button>
        )}
      </div>
        </div>
  )
}

export default Category