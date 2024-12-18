// 'use client'
// import { download } from "thirdweb/storage";
// import { client } from "../client";
// import { tokenURI } from "thirdweb/extensions/erc721";
// import { getContract } from "thirdweb";
// import { anvil } from "thirdweb/chains";
 

// export const downloadFile = async (tokenId:bigint, assetAddress: string) => {

//     const contract = getContract({
//   address: assetAddress, 
//   chain: anvil,
//   client,
//    });

//     const result = await tokenURI({
//  contract,
//  tokenId
// });

// const file = await download({
//   client,
//   uri: result,

// });
//   return file
// }
