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
import CardContainer from "../components/card/CardContainer";

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
 
  const fetchListings = useCallback(async () => {
    try {
      const listingsData = await listings();
      if (!listingsData || listingsData?.length == 0) {
        return [];
      }
   
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
              status: 'fulfilled',
              value: {
                src: ipfsToHttp(nft?.metadata.image!),
                name: nft?.metadata.name!,
                id: listing.tokenId.toString(),
                price: listing.pricePerToken.toString(),
                listingId: listing.tokenId
              } 
            };
          } catch (error) {
            return {
              status: 'rejected',
              reason: error
            };
          }
        })
      );

      // Filter out rejected promises and map successful results to Card components
      const validResults = results
        .filter((result) => 
          result.status === 'fulfilled')
        .map(result => (
          <Card
            key={result.value?.value?.id}
            alt={result.value?.value?.name!}
            id={result.value?.value?.id!}
            src={result.value?.value?.src!}
            price={result.value?.value?.price!}
            listingId={result.value?.value?.listingId!}
            name={result.value?.value?.name!}
          />
        ));

      return validResults.reverse();
    } catch (err) {
     console.error(`Failed to fetch NFT for listing ${listing.tokenId}:`, error);
            return {
              status: 'rejected',
              reason: error
            };
    }
  }, []);

  const { data: listing, error, mutate } = useSWR(
    'listings',
    fetchListings,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  console.log(listing)
  useEffect(() => {
    createListingModal.setMutateListings(mutate);
  }, [mutate]);

  if (error) return <Error error={error}/>;
  
  if (listing?.length == 0) return (
    <EmptyState
      title="Oops!"
      subtitle="No listing at the moment. Try creating one"
      label="Create listing"
      showButton
      onClick={createListingModal.onOpen}
    />
  );

  return (
    <CardContainer>
      {listing}
    </CardContainer>
  );
}