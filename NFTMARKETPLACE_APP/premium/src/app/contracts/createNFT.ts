import { ContractOptions, getContract, sendTransaction } from "thirdweb";
import { deployERC1155Contract, deployERC721Contract } from "thirdweb/deploys";
import { client } from "../client";
import {Account} from "thirdweb/wallets"
import { anvil } from "thirdweb/chains";
import {FieldValues} from "react-hook-form";
import { TOKENTYPE } from "../components/modal/CreateNftModal";




 function nftContract(contractAddress: string) {
const contract =  getContract({
 client,
 chain: anvil,
 address: contractAddress,
}); 

return contract;
} 



async function deploySingleNFT(account: Account, params: FieldValues) {
    const contractAddress = await deployERC721Contract({
 chain: anvil,
 client,
 account,
 type: "TokenERC721",
 params: {
   name: params.name,
   royaltyRecipient: account.address,
   royaltyBps: params.royalties,
   
 }
});

return contractAddress;
}

async function deployMultipleNFT(account: Account, params: FieldValues) {
    const contractAddress = await deployERC1155Contract({
 chain: anvil,
 client,
 account,
 type: "TokenERC1155",
 params: {
   name: params.name,
   royaltyRecipient: account.address,
   royaltyBps: params.amount,

   
 }
});

return contractAddress;
}


async function mintNFT(contract:Readonly<ContractOptions<any>>, to: string, params: FieldValues, account:Account) {
 if (params.tokenType === TOKENTYPE.SINGLE) {
    const transaction = (await import("thirdweb/extensions/erc721")).mintTo({
	  contract,
	  to: to,
    nft: {
      name: params.name,
      description: params.description,
      image: params.image,
      symbol: params.symbol,
    },
});
console.log(transaction);
await sendTransaction({ transaction, account });
 }
 else if (params.tokenType === TOKENTYPE.MULTIPLE) {
  console.log(params.amount);
    const transaction = (await import("thirdweb/extensions/erc1155")).mintTo({
	contract,
	to: to,
  supply: params.amount,
    nft: {
      name: params.name,
      description: params.description,
      image: params.image,
      symbol: params.symbol,
    },
});
console.log(transaction);
await sendTransaction({ transaction, account });
}
 

}



export default async function createNFT(account: Account, params:FieldValues) {
  let contractAddress;
 
  try {
    if (params.tokenType == TOKENTYPE.SINGLE) {
       contractAddress = await deploySingleNFT(account, params);
       console.log("single")
  }
  else if (params.tokenType == TOKENTYPE.MULTIPLE){
     contractAddress = await deployMultipleNFT(account, params);
       console.log("multiple")
  }
    
  const contract = nftContract(contractAddress!);

   mintNFT(contract, account.address, params, account); 

   return {
      success: true,
      message: "NFT creation successfully",
      contractAddress
    }
  } catch (error) {
    return {
      success: false,
      message: "NFT creation failed: Try again",
    }
  }
  
    
} 




