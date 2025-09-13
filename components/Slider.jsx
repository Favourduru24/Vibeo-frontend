'use client'
import { navLink } from "@/constants"
import Image from "next/image"
import Link from "next/link"
import { usePathname, } from "next/navigation"
import {useState, useRef, useEffect} from 'react'

const Slider = () => {

    const sidebarRef = useRef()
    const [isopen, setIsOpen] = useState(false)

    const pathname = usePathname()
         
    return (
       <aside className="fixed left-0 top-14 bottom-0 z-40 w-68 lg:w-68 transform lg:translate-x-0 transition-transform duration-300 pt-2 hidden lg:flex" onClick={() => setIsOpen(true)}>
           <div className="flex flex-col px-4 justify-between items-cente size-full h-full">
              <ul className="hidden w-full flex-col items-start md:flex">
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
              </ul>
                           

              <ul className="hidden w-full flex-col items-start md:flex">
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
              </ul>
           </div>            
       </aside>
    )
}

 export default Slider 