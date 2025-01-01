
"use client"
import React, { useCallback } from 'react';
import Image from "next/image";
import Button from '../Button';
import useDialog from '@/app/hooks/useDialog';
import { useRouter } from "next/navigation";
import useListingId from '@/app/hooks/useListingId';
import useMakeOfferModal from '@/app/hooks/useMakeOfferModal';



interface CardProps {
  src: string;
  alt: string;
  name: string;
  id: string;
  price: string;
  currency: string;
  listingId: bigint;
}

const Card = ({ src, alt, name, id, price, currency, listingId }: CardProps) => {
  const dialog = useDialog();
  const router = useRouter();
  const makeOfferModal = useMakeOfferModal();
  const _listingId = useListingId();

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
    router.push(`/marketplace/listing/${listingId}`);
  }, [router, listingId]);

  return (
    <div 
      className="relative h-[300px] w-full cursor-pointer border-1px border-rose-500 bg-rose-500 rounded-lg overflow-hidden 
                 shadow-lg transition-all duration-500 ease-in-out group"
      onMouseEnter={handleMouseEnter}
      onClick={handleCardClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-rose-500 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out blur"></div>
      <div className="absolute inset-[2px] bg-gray-900 rounded-lg z-10 overflow-hidden">
        <div className="relative h-[300px]">
          <Image
            src={src}
            alt={alt}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-500 ease-in-out group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"></div>
        </div>
        
        <div className="absolute inset-x-0 bottom-0 p-4 space-y-2 transition-all duration-500 ease-in-out transform translate-y-0 group-hover:-translate-y-full">
          <div className='flex w-full justify-between'>
          <p className="text-xl font-bold text-white capitalize truncate ">{name}</p>
          <p className="text-xl font-bold text-rose-500">#{id}</p>
          </div>
          <p className="text-xl font-extrabold text-transparent bg-clip-text  bg-gradient-to-r from-rose-500 to-rose-700">
            {price} <span className="uppercase">{currency}</span>
          </p>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4 space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out transform translate-y-full group-hover:translate-y-0">
          <Button 
            actionLabel="Make Offer" 
            classNames="w-full text-white bg-transparent border border-rose-500 
                       text-sm px-4 py-2 hover:bg-rose-500 rounded-lg 
                       transition-colors duration-300 backdrop-blur-sm"
            onClick={handleMakeOffer}
          />
          <Button 
            actionLabel="Buy Now"
            classNames="w-full text-white border border-rose-500 
                       text-sm px-4 py-2 bg-rose-500 hover:bg-rose-600 
                       rounded-lg transition-colors duration-300 backdrop-blur-sm"
            onClick={handleBuyListing}
          />
        </div>
      </div>
    </div>
  );
};

export default Card;



// "use client"
// import React, { useCallback } from 'react';
// import Image from "next/image";
// import Button from '../Button';
// import useDialog from '@/app/hooks/useDialog';
// import { useRouter } from "next/navigation";
// import useListingId from '@/app/hooks/useListingId';
// import useMakeOfferModal from '@/app/hooks/useMakeOfferModal';

// interface CardProps {
//   src: string;
//   alt: string;
//   name: string;
//   id: string;
//   price: string;
//   currency?: string;
//   listingId: bigint;
// }

// const Card = ({ src, alt, name, id, price, currency = 'Matic', listingId }: CardProps) => {
//   const dialog = useDialog();
//   const router = useRouter();
//   const makeOfferModal = useMakeOfferModal();
//   const _listingId = useListingId();

//   const handleMouseEnter = useCallback(() => {
//     _listingId.setListingId(listingId)
//   }, [_listingId, listingId])

//   const handleMakeOffer = useCallback((e: React.MouseEvent) => {
//     e.stopPropagation();
//     makeOfferModal.onOpen();
//   }, [makeOfferModal]);

//   const handleBuyListing = useCallback((e: React.MouseEvent) => {
//     e.stopPropagation();
//     dialog.onOpen();
//   }, [dialog]);

//   const handleCardClick = useCallback(() => {
//     router.push(`/marketplace/listing/${listingId.toString()}`);
//   }, [router, listingId]);

//   return (
//     <div 
//       className="relative cursor-pointer bg-gray-900 rounded-lg overflow-hidden shadow-lg 
//                  transition-all duration-500 ease-in-out max-w-sm w-full group"
//       onMouseEnter={handleMouseEnter}
//       onClick={handleCardClick}
//     >
//       {/* Stylistic border */}
//       <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-rose-500 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out blur"></div>
//       <div className="absolute inset-[2px] bg-gray-900 rounded-lg z-10 overflow-hidden">
//         <div className="relative aspect-square">
//           <Image
//             src={src}
//             alt={alt}
//             fill
//             style={{ objectFit: 'cover' }}
//             className="transition-transform duration-500 ease-in-out group-hover:scale-110"
//             sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//             priority
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"></div>
//         </div>
        
//         {/* Info section that moves up on hover */}
//         <div className="absolute inset-x-0 bottom-0 p-4 space-y-2 transition-all duration-500 ease-in-out transform translate-y-0 group-hover:-translate-y-full">
//           <h3 className="text-xl font-bold text-white truncate">{name}</h3>
//           <p className="text-sm text-rose-300">#{id}</p>
//           <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600">
//             {price} {currency}
//           </p>
//         </div>

//         {/* Button container that appears on hover */}
//         <div className="absolute inset-x-0 bottom-0 p-4 space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out transform translate-y-full group-hover:translate-y-0">
//           <Button 
//             actionLabel="Make Offer" 
//             classNames="w-full text-white bg-transparent border-2 border-rose-500 
//                        text-sm px-4 py-2 hover:bg-rose-500 rounded-lg 
//                        transition-colors duration-300 backdrop-blur-sm"
//             onClick={handleMakeOffer}
//           />
//           <Button 
//             actionLabel="Buy Now"
//             classNames="w-full text-white border-2 border-rose-500 
//                        text-sm px-4 py-2 bg-rose-500 hover:bg-rose-600 
//                        rounded-lg transition-colors duration-300 backdrop-blur-sm"
//             onClick={handleBuyListing}
//           />
//         </div>
//       </div>

//       {/* Glowing effect on hover */}
//       <div className="absolute inset-0 opacity-0 group-hover:opacity-75 transition-opacity duration-500 ease-in-out">
//         <div className="absolute inset-0 bg-rose-500 blur-xl"></div>
//         <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
//       </div>
//     </div>
//   );
// };

// export default Card;








//  <div 
//       className="relative group cursor-pointer bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl"
//       onMouseEnter={handleMouseEnter}
//       onClick={handleCardClick}
//     >
//       {/* Fancy border effect */}
//       <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-rose-500 to-rose-600 opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-300"></div>
//       <div className="absolute inset-0.5 bg-gray-900 rounded-lg overflow-hidden">
//         <div className="relative aspect-square">
//           <Image
//             src={src}
//             alt={alt}
//             fill
//             style={{ objectFit: 'cover' }}
//             className="transition-transform duration-300 group-hover:scale-110"
//             sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//             priority
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//         </div>
//         <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
//           <h3 className="text-lg font-semibold mb-1 truncate">{name}</h3>
//           <p className="text-sm mb-2 opacity-75">#{id}</p>
//           <p className="text-lg font-bold mb-3">{price} {currency}</p>
//           <div className="flex justify-between gap-2">
//             <Button 
//               actionLabel="Make Offer" 
//               classNames="flex-1 text-white border-2 border-rose-500 text-xs px-3 py-2 hover:bg-rose-500 rounded-lg transition-colors duration-300"
//               onClick={handleMakeOffer}
//             />
//             <Button 
//               actionLabel="Buy Now"
//               classNames="flex-1 text-white border-2 border-rose-500 text-xs px-3 py-2 bg-rose-500 hover:bg-rose-600 rounded-lg transition-colors duration-300"
//               onClick={handleBuyListing}
//             />
//           </div>
//         </div>
//       </div>
//     </div>


