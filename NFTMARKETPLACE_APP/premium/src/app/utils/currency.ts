import { NATIVE_TOKEN } from "./address";

export const fetchCurrencyInfo = async (contractAddress: string) => {
  let response;
    if (contractAddress ==  NATIVE_TOKEN) {
     const address = "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0"  //use wrapped matic
          response = await fetch(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}`); 
        
    }
    else {
        response = await fetch(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${contractAddress}`);
    }
   
    
          if (!response?.ok) {
            throw new Error(`Failed to fetch token info for ${contractAddress}`);
          }

          const data = await response.json();
          console.log('Fetched token info:', data); // Logging fetched data
          return data;
        }
