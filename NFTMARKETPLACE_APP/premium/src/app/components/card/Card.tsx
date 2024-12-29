"use client"
import React, { useCallback } from 'react';
import { useState, useEffect } from 'react';
import Image from "next/image";
import Button from '../Button';
import useDialog from '@/app/hooks/useDialog';
import { useRouter } from "next/navigation";
import useListingId from '@/app/hooks/useListingId';
import useMakeOfferModal from '@/app/hooks/useMakeOfferModal';
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
  const makeOfferModal = useMakeOfferModal();
  const _listingId = useListingId();
 
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 25);
    return () => clearInterval(interval);
  }, []);
  const handleMouseEnter = useCallback(() => {
   _listingId.setListingId(listingId)
  }, [_listingId, listingId])
  const handleMakeOffer = useCallback(() => {
    
    makeOfferModal.onOpen();
  }, [makeOfferModal]);

  const handleBuyListing = useCallback(() => {
    
    dialog.onOpen();
  }, [dialog]);

  const handleCardClick = useCallback(() => {
    router.push(`/marketplace/listing/${listingId.toString()}`);
  }, [router, listingId]);

  return (
    <div 
      className="relative group cursor-pointer" 
      onMouseEnter={handleMouseEnter}
      onClick={handleCardClick}
    >
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        <div className="absolute inset-0 z-10 flex flex-col justify-between p-4">
          <div className="flex justify-end gap-2">
            <Button 
              actionLabel="Make Offer" 
              classNames="text-white border-[2px] border-rose-500 text-[10px] px-3 py-2 sm:px-4 sm:py-2 hover:bg-rose-500 rounded-lg"
              onClick={handleMakeOffer}
            />
            <Button 
              actionLabel="Buy Listing"
              classNames="text-white border-[2px] border-rose-500 text-[10px] px-3 py-2 sm:px-4 sm:py-2 hover:bg-rose-500 rounded-lg"
              onClick={handleBuyListing}
            />
          </div>
          <div className="text-white">
            <p>{name}</p>
            <p>#{id}</p>
            <p>{price} Matic</p>
          </div>
        </div>
        <Image
          src={src}
          alt={alt}
          fill
          style={{ objectFit: 'cover' }}
          className="rounded-lg transition-transform duration-300 group-hover:scale-95"
          sizes="(max-width: 640px) 40vw, 60vw"
          priority
        />
      </div>
    </div>
  );
};


export default Card;