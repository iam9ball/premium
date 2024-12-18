import {
  sendTransaction,
  getContract,
  prepareContractCall,
  readContract,
} from "thirdweb";
import { anvil } from "thirdweb/chains";
import {contractAddress} from "./constant"
import { client } from "../client";
import { Account } from "thirdweb/wallets";
import { listingFee, listingInfo, listings } from "./platformInfo";
import { NATIVE_TOKEN } from "../utils/address";

import { approve, isERC721 } from "thirdweb/extensions/erc721";
import { isERC1155, setApprovalForAll } from "thirdweb/extensions/erc1155";
import { contract } from "./getContract";


export enum ListingType {
        BASIC,
        ADVANCED,
        PRO
    }


 

   

  
 export const createListing = async ({assetAddress, assetId, currencyAddress, assetPrice, listingPlan, reserved}:{
  assetAddress: string,
  assetId: bigint,
  currencyAddress: string,
  assetPrice: bigint,
  listingPlan: ListingType,
  reserved: boolean
 }, account:Account) => {
  console.log("yes")
   const data =  await listingInfo(listingPlan);
   let fee: bigint | undefined ;
   if (currencyAddress == NATIVE_TOKEN){
   
      fee = await listingFee(currencyAddress, data?.[1])
     
         console.log(fee);
       
   }
   else {
    fee = undefined;
   }
    
  // Approve the contract 
  const assetContract = getContract({
  address: assetAddress, 
  chain: anvil,
  client,
  
   });


   const erc721 = await isERC721({
     contract: assetContract,
   });
   
   const erc1155 = await isERC1155({
    contract: assetContract,
  });
   
    
  let approveTransaction;
   if (erc721) {
    approveTransaction = approve({
    contract: assetContract,
    to: contractAddress,
    tokenId: assetId
   });
   } else if (erc1155) {
     approveTransaction = setApprovalForAll({
   contract: assetContract,
   operator: contractAddress,
   approved: true
});
  
   }
       

// Send the transaction
try {
   await sendTransaction({ transaction: approveTransaction!, account });
}
catch (error) {
    return {
      message: "Error approving market: Market must be approved to proceed with transaction"
    }
}



    
  const transaction = prepareContractCall({
  contract,
  method: "createListing",
  params: [{
    assetContract: assetAddress,
    tokenId: assetId,
    currency: currencyAddress,
    pricePerToken: assetPrice,
    listingType: listingPlan,
    reserved,
  }],
  
  value: fee


});

try {
    const { transactionHash } = await sendTransaction({
  account,
  transaction,
}); 
console.log(transactionHash)

return {
  success: true,
  message: "Listing created successfully"
  }
} catch (error: any) {
  let message;
  if (error?.message.includes('__DirectListing_TransferFailed')) {
   message = "Error transferring fee: Make sure you are sending a sufficient amount"  
  }
  
  else {
    message = "An unexpected erorr occured: Try again"
  }

  return {
    success: false,
    message: message 
  }

}


}


export const buyListing = async (recipientAddress: string , listingId: bigint, account: Account) => {
let fee: bigint | undefined ;
   

    const data = await readContract({
     contract,
     method:"getListing",
      params: [listingId]
    })

  if (data.currency == NATIVE_TOKEN){
   
      fee = data.pricePerToken
         console.log(fee); 
   }
   else {
    fee = undefined;
   }

  const transaction = prepareContractCall({
  contract,
  method: "buyFromListing",
  params: [listingId, recipientAddress],
  
  value: fee


});
try {

const { transactionHash } = await sendTransaction({
  account,
  transaction,
}); 
console.log(transactionHash)

return {
  success: true,
  message: "Listing purchased successfully"
  }
} catch (error: any) {
   let message;
  if (error?.message.includes('__DirectListing_BuyerNotApproved')) {
   message = "You are not approved to buy this reserved listing"  
  }
   
   if (error?.message.includes('__DirectListing_InvalidRequirementToCompleteASale')){
    message = "Error purchasing listing: You cannot purchase this listing"
  }
  if (error?.message.includes('__DirectListing_InsufficientFunds')){
    message = "Error purchasing listing: Make sure you are sending enough funds"
  }

  return {
    success: false,
    message: message 
  }

}


}



