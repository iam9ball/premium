'use client'
import { useState, useCallback, useEffect } from "react";
import Card from "./card/Card";
import { getContract } from "thirdweb";
import { anvil } from "thirdweb/chains";
import { client } from "../client";
import { fetchNFT, listings } from "../contracts/listingInfo";
import { ipfsToHttp } from "../utils/ipfsToHttp";
import useSWR from 'swr';
import useCreateListingModal from "../hooks/useCreateListingModal";
interface ListingData {
  src: string;
  name: string;
  id: string;
  price: string;
  listingId: string;
  error?: string;
}
export default function Listings() {
  const createListingModal = useCreateListingModal();
 
  const fetchListings = useCallback(async() => {
    const listingsData = await listings();
    if (!listingsData?.length) return [];
    const results = await Promise.allSettled(
      listingsData.map(async (listing) => {
        try {
          const contract = getContract({
            client,
            chain: anvil,
            address: listing.assetContract,
          });
          const nft = await fetchNFT(contract, listing);
         
          return {
            src: ipfsToHttp(nft?.metadata.image!),
            name: nft?.metadata.name!,
            id: listing.tokenId.toString(),
            price: listing.pricePerToken.toString(),
            listingId: listing.listingId
          };
        } catch (err) {
          return {
            error: `Failed to fetch NFT ${listing.tokenId}`,
            id: listing.tokenId.toString(),
            listingId: listing.listingId,
            name: "Error",
            price: "0",
            src: ""
          };
        }
      })
    );
    return results.toReversed().map(listing => (
      listing.status === 'fulfilled' && (
        <Card
          key={listing.value.id}
          // {...listing}
          alt={listing.value.name}
          id={listing.value.id}
          src={listing.value.src}
          price={listing.value.price}
          listingId={listing.value.listingId}
          name={listing.value.name}
         
        />
      )))
  }, []);
  const { data: listing, error, isLoading, mutate } = useSWR(
    'listings',
    fetchListings,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );
  useEffect(() => {
    createListingModal.setMutateListings(mutate);
  }, [mutate]);

   if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching listings</div>;

  return <>{listing}</>;
}