'use client'
import Image from "next/image"
import premium from "@public/premium.jpeg"
import {useWindowWidth} from "@react-hook/window-size";

export default function Logo() {

   const width = useWindowWidth();


   const size = () => {
    if (width >= 1024) {
      return 44
    }
    else if (width >= 768) {
      return 40
    }
    else {
      return 36
      }
    
  }

  return (
    <div className="inline-flex items-center justify-center">
      <div className="flex items-center h-10 sm:h-12 sm:w-28 md:w-36 lg:w-40">
        <Image 
          src={premium}
          alt="Premium logo"
          height={size()}
          width={size()}
          className="rounded-xl object-cover"
          priority
        />
        <span className="pl-3 font-logo text-[14px] md:text-[20px] font-bold tracking-tighter ">
          Prime
        </span>
      </div>
    </div>
  )
}