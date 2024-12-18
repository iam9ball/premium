// Card.tsx
"use client"
import React, { useCallback } from 'react';
import { useState, useEffect } from 'react';
import Image from "next/image";
import Button from '../Button';
import useDialog from '@/app/hooks/useDialog';
import { useRouter } from "next/navigation";
import useBuyListingModal from '@/app/hooks/useBuyListingModal';



interface CardProps {
  src: string ;
  alt: string;
  name: string;
  id: string;
  price: string;
  currency?: string;
  listingId: bigint;
}

  
const Card = ({ src, alt, name, id, price, currency,  listingId }: CardProps) => {
  const [rotation, setRotation] = useState(132);
  const dialog = useDialog();
  const router = useRouter();
  const buyListingModal = useBuyListingModal();

  const onClick = () => {
    dialog.onOpen();
   
  }


  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 25);
    return () => clearInterval(interval);
  }, []);

  const handleMouseEnter = useCallback(() => {
   buyListingModal.setListingId(listingId)
  }, [buyListingModal, listingId]) 

  return (
   
    <div onMouseEnter={handleMouseEnter} className="w-full aspect-[3/4] cursor-pointer" >
      <div className="relative h-[80%] w-[90%] group" onClick={()=> router.push(`/marketplace/listing/${listingId.toString()}`)}>
        {/* Background gradient animation */}
        <div
          className="absolute top-[-1%] left-[-2%] w-[104%] h-[102%] rounded-lg z-[-1]"
          style={{
            backgroundImage: `linear-gradient(${rotation}deg, #5ddcff, #3c67e3 43%, #4e00c2)`,
          }}
        />
        
        {/* Blur effect */}
        <div
          className="absolute top-[calc(65vh/6)] left-0 right-0 w-full h-full mx-auto z-[-1] scale-80 opacity-100 transition-opacity duration-500 blur-[calc(65vh/6)]"
          style={{
            backgroundImage: `linear-gradient(${rotation}deg, #5ddcff, #3c67e3 43%, #4e00c2)`,
          }}
        />

        {/* Main card content */}
        <div className="relative h-full w-full overflow-hidden rounded-lg p-2 ">
          <div className="absolute  h-[76%] w-[95%] z-40 hidden rounded-lg group-hover:block bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-[1.5px] bg-opacity-30">
            <div className="absolute w-full h-full flex flex-col space-y-5 justify-center items-center">
                <Button  actionLabel="Make Offer" classNames="text-white border-[2px] border-rose-500 text-[10px] px-3 py-2 sm:px-4 sm:py-2 hover:bg-rose-500 rounded-lg" onClick={() => {}}/>
                 <Button  actionLabel="Buy Listing"  classNames="text-white  border-[2px] border-rose-500 text-[10px] px-3 py-2 sm:px-4 sm:py-2 hover:bg-rose-500 rounded-lg" onClick={onClick}/>

           </div>
          </div>
          
           
          <div className="relative w-full h-[80%] ">
            <Image 
              src={src} 
              alt={alt} 
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg transition-transform duration-300 group-hover:scale-95"
              sizes="(max-width: 640px) 40vw,
                     60vw"
              priority
            />
          </div>
          <div className=" flex w-full h-[10%] pt-1 justify-between font-bold text-[rgb(88,199,250)] transition-colors duration-1000  text-sm">
            <div className="uppercase">{name}</div>
            <div className=""># {id}</div>
          </div>
          <div className=" flex w-full h-[10%] pt-1 justify-between font-bold text-[rgb(88,199,250)] transition-colors duration-1000 text-sm">
           <div className="">{price}{" "}Matic</div>
         </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
