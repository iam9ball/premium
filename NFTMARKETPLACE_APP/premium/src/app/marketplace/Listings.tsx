'use client'
import { useState, useCallback, useEffect } from "react";
import Card from "../components/card/Card";
import { getContract } from "thirdweb";
import { anvil } from "thirdweb/chains";
import { client } from "../client";
import { fetchNFT, listings } from "../contracts/listingInfo";
import { ipfsToHttp } from "../utils/ipfsToHttp";
import useSWR from 'swr';
import useCreateListingModal from "../hooks/useCreateListingModal";
import EmptyState from "../components/EmptyState";
import Error from "../components/Error";
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
    
    const results = await Promise.allSettled(
      listingsData.map(async (listing) => {
        try {
          const contract = getContract({
            client,
            chain: anvil,
            address: listing.assetContract,
          });
          const nft = await fetchNFT(contract, listing);
         
          return (
          
          <Card
          key={listing.tokenId}
          alt={nft?.metadata.name!}
          id={listing.tokenId.toString()}
          src={ipfsToHttp(nft?.metadata.image!)}
          price={listing.pricePerToken.toString()}
          listingId={listing.tokenId}
          name={nft?.metadata.name!}
         
        />

            // src: ipfsToHttp(nft?.metadata.image!),
            // name: nft?.metadata.name!,
            // id: listing.tokenId.toString(),
            // price: listing.pricePerToken.toString(),
            // listingId: listing.listingId
          );
        } catch (err) {
          console.error(err);
        }
      })
    );
    return results.toReversed()
  }, []);


  const { data: listing, error, mutate } = useSWR(
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

  if (error) return <Error error={error}/>;
  if (!listing?.length) return (
                <EmptyState 
                title="Oops!" 
                subtitle="No listing at this moment. Try creating one" 
                label="Create listing"
                showButton
                onClick={createListingModal.onOpen}
                />
              );
  return (
    <>{listing.map((item: any) => item)}</>
  );
}