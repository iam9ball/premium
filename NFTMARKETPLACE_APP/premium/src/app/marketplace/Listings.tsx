









// 'use client'
// import { useState, useCallback, useEffect } from "react";
// import Card from "../components/card/Card";
// import { getContract } from "thirdweb";
// import { anvil } from "thirdweb/chains";
// import { client } from "../client";
// import { fetchNFT, listings } from "../contracts/listingInfo";
// import { ipfsToHttp } from "../utils/ipfsToHttp";
// import useSWR from 'swr';
// import useCreateListingModal from "../hooks/useCreateListingModal";
// import EmptyState from "../components/EmptyState";
// import Error from "../components/Error";
// import CardContainer from "../components/card/CardContainer";

// interface ListingData {
//   src: string;
//   name: string;
//   id: string;
//   price: string;
//   listingId: string;
// }

// export default function Listings() {
//   const createListingModal = useCreateListingModal();
 
//   const fetchListings = async () => {
//     try {
//       const listingsData = await listings();
//       if (!listingsData || listingsData.length === 0) {
//         return [];
//       }
   
//       const results = await Promise.all(listingsData.map(async (listing) => {
//         try {
//           const contract = getContract({
//             client,
//             chain: anvil,
//             address: listing.assetContract,
//           });
//           const nft = await fetchNFT(contract, listing);
          
//           if (!nft?.metadata) {
//             console.error('Missing NFT metadata for listing:', listing.listingId);
//             return null;
//           }

//           return {
//             key: listing.listingId,
//             alt: nft.metadata.name!,
//             id: listing.tokenId.toString(),
//             src: ipfsToHttp(nft.metadata.image!),
//             price: listing.pricePerToken.toString(),
//             listingId: listing.listingId,
//             name: nft.metadata.name!,
//           };
//         } catch (error) {
//           console.error('Error fetching listing:', listing.listingId, error);
//           return null;
//         }
//       }));

//       return results.filter(Boolean).reverse();
//     } catch (error) {
//       console.error('Error fetching listings:', error);
//       return [];
//     }
//   };

//   const { data: listing, error, mutate } = useSWR(
//     'listings',
//     fetchListings,
//     {
//       revalidateOnFocus: false,
//       revalidateOnReconnect: true,
//     }
//   );

//   useEffect(() => {
//     createListingModal.setMutateListings(mutate);
//   }, [mutate]);

//   if (error) return <Error error={error} />;
  
//   if (listing?.length === 0) return (
//     <EmptyState
//       title="Oops!"
//       subtitle="No listing at the moment. Try creating one"
//       label="Create listing"
//       showButton
//       onClick={createListingModal.onOpen}
//     />
//   );

//   return (
//     <CardContainer>
//       {listing?.map((item) => (
//         <Card
//           key={item?.key!}
//           alt={item?.alt!}
//           id={item?.id!}
//           src={item?.src!}
//           price={item?.price!}
//           listingId={item?.listingId!}
//           name={item?.name!}
//         />
//       ))}
//     </CardContainer>
//   );
// }





'use client'
import { useEffect } from "react";
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
import {CardContainer} from "../components/card/CardContainer";
import Container from "../components/Container";
import CardSkeletonContainer from "../components/card/CardSkeleton";
import { fetchCurrencyInfo } from "../utils/currency";


export default function Listings() {
  const createListingModal = useCreateListingModal();
 
  const fetchListings = async () => {
    try {
      const listingsData = await listings();
      if (!listingsData || listingsData.length === 0) {
        return [];
      }
   
      const results = await Promise.allSettled(listingsData.map(async (listing) => {
        try {
          const contract = getContract({
            client,
            chain: anvil,
            address: listing.assetContract,
          });
          const nft = await fetchNFT(contract, listing);
          const currency = await fetchCurrencyInfo(listing.currency)
          
          if (!nft?.metadata) {
            console.error('Missing NFT metadata for listing:', listing.listingId);
            return null;
          }

          return {
            key: listing.listingId.toString(),
            alt: nft.metadata.name || '',
            id: listing.tokenId.toString(),
            src: ipfsToHttp(nft.metadata.image || ''),
            price: listing.pricePerToken.toString(),
            listingId: listing.listingId,
            name: nft.metadata.name || '',
            symbol: currency.symbol
          };
        } catch (error) {
          console.error('Error fetching listing:', listing.listingId, error);
          return null;
        }
      }));

      return results.filter(result => result.status === 'fulfilled').map(result => result.value).reverse();
    } catch (error) {
      console.error('Error fetching listings:', error);
      return [];
    }
  };

  const { data: listing, error, mutate,isLoading } = useSWR(
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

  if(isLoading) return (
  <CardContainer> 
    <CardSkeletonContainer/> 
  </CardContainer>)

console.log(listing?.length)
  console.log(listing)

  if (error) return <Error error={error} />;

  
  if (listing?.length === 0) return (
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
      {listing?.map((item) => (
        <Card
          key={item?.key!}
          alt={item?.alt!}
          id={item?.id!}
          src={item?.src!}
          price={item?.price!}
          listingId={item?.listingId!}
          name={item?.name!}
          currency={item?.symbol}
        />
      ))}
    </CardContainer>
  );
}


