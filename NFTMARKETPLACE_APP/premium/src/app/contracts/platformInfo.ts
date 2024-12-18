import { contract } from './getContract';
import { readContract } from 'thirdweb';
import { ListingType } from './listing';


export const listingInfo = async (params: ListingType) => {
  try {
    const data = await readContract({
      contract,
      method: "getListingTypeInfo",
      params: [params]     
    });

    if (!data) {
      console.log("No data returned");
     
    }

    return data;
  } catch (error) {
    console.error(error);
    // Handle the error appropriately
    throw error;
  }
}


export const listingFee = async (currency: string, price:bigint) => {
  try {
    const  data  = await readContract({
  contract,
  method:"getPlatformFee",
   params: [currency, price]     
})
   return data;
  } 
  catch (error) {
   console.error(error);
    // Handle the error appropriately
    throw error;
 }


}


export const listings = async () => {

  try {
     const data = await readContract({
     contract,
     method:"getAllListings",
      params: []
  });
  // console.log("data")
  // console.log(data.length)

  if (!data) {
      console.log("No data returned");
    }
  return data;
  
  } catch (error) {
    
     console.error(error);
     throw error;
  }
  
    
}

export const getListing = async (listingId: bigint) => {
  try {
      const data = await readContract({
     contract,
     method:"getListing",
      params: [listingId]
    })

   return data;  
  }
  catch (error) {
    console.error(error);
    throw error
  }
    

}

export const fetchNFT = async (contract: any, listing: any) => {
  try {
    if (listing.tokenType == 0) {
       const nft = (await (import ("thirdweb/extensions/erc721"))).getNFT({
           contract,
            tokenId: listing.tokenId
        })
        return nft;
      } else if (listing.tokenType == 1) {
       const nft = (await (import ("thirdweb/extensions/erc1155"))).getNFT({
           contract,
            tokenId: listing.tokenId
        })
        return nft;
      } 
  } catch (error) {
    console.error(error);
    throw error;
  }

     
    }





