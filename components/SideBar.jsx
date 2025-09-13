'use client'
import { useState, useRef, useEffect } from 'react'
import {usePathname} from 'next/navigation'
import { navLink } from '@/constants';
import Link from 'next/link';
import Image from 'next/image';


const SideBar = ({sliderOpen, setsliderOpen}) => {
    const sidebarRef = useRef(null)
    const pathname = usePathname()
    

       useEffect(() => {
        const handleClickOutside = (e) => {
          if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
            setsliderOpen(false);
          }
        };
    
        const handleEscape = (e) => {
          if (e.key === "Escape") setsliderOpen(false);
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
    
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
          document.removeEventListener("keydown", handleEscape);
        };
      }, []);

  return (
    // <div className={`fixed inset-0 flex `} ref={sidebarRef}>
         <div className={`w-68 h-full bg-black-100 z-48 transform transition-transform duration-300 ease-in-out pt-2 fixed inset-0 px-4 ${ sliderOpen ? '-translate-x-0' : '-translate-x-full'} `}>
        <ul className=" relative  h-full flex flex-col justify-between  bg-black-100">
                  <li className="w-full flex-col items-start md:flex">
                     <div className="flex gap-2 items-center py-1 pb-4">
                                 <Image src='/assets/icons/menu.png' width={28} height={28} alt="menu" className="size-8 cursor-pointer" onClick={() => setsliderOpen((prev) => !prev)}/>
                                <p className="text-3xl font-semibold text-[#f1f1f1] whitespace-nowrap shrink-0">Viboe</p> 
                        </div>

                {navLink.slice(0, 4).map((nav) => {
                    const isActive = pathname === nav.route
                    return (
                        <Link href={nav.route} className="w-full" key={nav.route}>
                        <div className={`${isActive ? 'bg-[#212121] rounded-lg text-[#f1f1f1] hover:bg-[#ffffff33]' : ''}  px-2 py-2  w-full rounded-lg hover:bg-[#212121] cursor-pointer flex items-center gap-4`} >
                        <Image src={nav.icon} width={24} height={24} alt="nav-link" className="size-6 font-bold"/>
                            <p className="text-[15px] text-[#f1f1f1] font-semibold">{nav.label}</p>
                        </div>
                        </Link>
                    
                    )
})}
              </li>
                           

              <li className=" w-full flex-col items-start md:flex">
                {navLink.slice( 4).map((nav) => {
                    const isActive = pathname === nav.route
                    return (
                        <Link href={nav.route} className="w-full" key={nav.route}>
                        <div className={`${isActive ? 'bg-[#212121] rounded-lg text-[#f1f1f1] hover:bg-[#ffffff33]' : ''}  px-2 py-2  w-full rounded-lg hover:bg-[#212121] cursor-pointer flex items-center gap-4`} >
                        <Image src={nav.icon} width={24} height={24} alt="nav-link" className="size-6 font-bold"/>
                            <p className="text-[15px] text-[#f1f1f1] font-semibold">{nav.label}</p>
                        </div>
                        </Link>
                    
                    )
})}
              </li>
            </ul>
         {/* </div> */}
          <div onClick={() => setsliderOpen((prev) => !prev)}>Open/Close</div>
                
              </div>
  )
}

export default SideBar