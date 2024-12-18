 'use client'

import { useState, useEffect, useCallback } from "react";
import Card from "./card/Card";
import { getContract } from "thirdweb";
import { anvil } from "thirdweb/chains";
import { client } from "../client";
import { fetchNFT, listings } from "../contracts/platformInfo";

import { ipfsToHttp } from "../utils/ipfsToHttp";
import useSWR from 'swr';
import useCreateListingModal from "../hooks/useCreateListingModal";






export default function Listings() {
  
  const createListingModal = useCreateListingModal();
  const fetchListings = async () => {
    const data = await listings();
    
    if (!data || data.length === 0) {
      return [];
    }

    const listingPromises = await Promise.all(data.map(async (listing, index) => {
      const contract = getContract({
        client,
        chain: anvil,
        address: listing.assetContract,
      });

        const nft = await fetchNFT(
            contract,
            listing
          );

      return (
       
          <Card
            key={index}
            src={ipfsToHttp(nft?.metadata.image!)}
            alt={nft?.metadata.name || "NFT"}
            name={nft?.metadata.name!}
            id={`${listing.tokenId}`}
            price={`${listing.pricePerToken}`}
            listingId={listing.listingId}
          />
       
      )
    }));

    return listingPromises;
  };

  // Use SWR for data fetching
  const { data: fetchedListings, error, isLoading, mutate } = useSWR(
    'listings', 
    fetchListings,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

   useEffect(() => {
    
     createListingModal.setMutateListings(mutate);

    
  }, [mutate]);

    

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching listings</div>;

  return <>
    {fetchedListings?.map(item => item).toReversed()}
   
  
  </>;
}








  

  
  
