"use client";
import React, {useCallback, useState} from "react";
import { AiFillBell, AiOutlineMenu } from "react-icons/ai";
import MenuItem from "./MenuItem";
import Button from "../Button";
import useCreateNftModal from "@/app/hooks/useCreateNftModal";
import useCreateListingModal from "@/app/hooks/useCreateListingModal"



export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const createNftModal = useCreateNftModal();
  const createListingModal = useCreateListingModal();

  

  const toggleOpen = useCallback(() => {
    setIsOpen((isOpen) => !isOpen);
  }, []);
  const handleMyListings = useCallback(() => {
    setIsOpen(false);
  }, []);
  const handleMyAuctions = useCallback(() => {
    setIsOpen(false);
  }, []);
  const handleMyOffers = useCallback(() => {
    setIsOpen(false);
  }, []);
  const handleCreateListings = useCallback(() => {
    setIsOpen(false);
    createListingModal.onOpen()
  }, []);
  const handleCreateNFT = useCallback(() => {
    setIsOpen(false);
    createNftModal.onOpen()
  }, []);
  const handleCreateAuctions = useCallback(() => {
    setIsOpen(false);
  }, []);

   
  return (
    <>
      <div className="relative flex flex-row md:w-[30%] items-center justify-evenly gap-3">
        <div
          className="hidden lg:block"
        >
          <Button variant="connect" defaultConnectButton={true}/>
        </div>
          <div className="cursor-pointer text-rose-500 relative">
          <AiFillBell  size={25}/>
          <span className=" absolute rounded-full h-1 w-1 top-[-2px] right-[-0.1px] text-rose-500 text-xs ">0</span>
          </div>
          
          <div
          onClick={toggleOpen}
          className="cursor-pointer text-rose-500"
          > 
           <AiOutlineMenu size={25}/>
          </div> 
      </div>
        <div className="absolute rounded-md z-50 shadow-md w-1/3 sm:w-1/5 md:w-[18%] bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40  border-gray-100 overflow-hidden right-0 top-16 text-xs sm:text-sm md:text-base">
          <div className="flex flex-col cursor-pointer">
         {isOpen && (
            <>  
                <MenuItem onClick={handleMyListings} label="My Listings" />
                 <hr />

                <MenuItem onClick={handleMyAuctions} label="My Auctions" />
                 <hr />

                <MenuItem onClick={handleMyOffers} label="My Offers" />
                 <hr />

                <MenuItem onClick={handleCreateListings} label="Create Listing" />
                 <hr />

                <MenuItem onClick={handleCreateAuctions} label="Create Auction" />
                <hr />

                 <MenuItem onClick={handleCreateNFT} label="Create NFT" />
                 <hr/>
                 <div className="lg:hidden p-1 flex items-center justify-center">
                  <Button variant="connect" defaultConnectButton={true} primaryConnect />

                </div>
              </>
         )}   
             
          </div>
        </div>
    </>
  );
}
