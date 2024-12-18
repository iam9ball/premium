import { useState, useEffect, useMemo, use } from 'react';
import { useReadContract } from 'thirdweb/react';
import { contract } from '../contracts/getContract';

import { readContract, ZERO_ADDRESS } from 'thirdweb';
import {
  useQuery
} from '@tanstack/react-query'


const fetchCurrencyInfo = async (contractAddress: string) => {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${contractAddress}`);
    
          if (!response.ok) {
            throw new Error(`Failed to fetch token info for ${contractAddress}`);
          }

          const data = await response.json();
          console.log('Fetched token info:', data); // Logging fetched data
          return data;
        }


export const useCurrency = () => {
 

   
  const  datas  = readContract({
  contract,
  method: "getAllCurrency"
});





const currencyAddress = useMemo(() => ["0xdac17f958d2ee523a2206206994597c13d831ec7", 
  "0x6b175474e89094c44da98b954eedeac495271d0f", "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0"], []);

  const { data, error, isLoading } = useQuery({queryKey: ["tokenInfos"],  queryFn:() =>  Promise.all(currencyAddress.filter(addr => addr != ZERO_ADDRESS).map(fetchCurrencyInfo))});
  
  // return {
  //   currencyInfo: data,
  //   isLoading,
  //   error
  // };

  const formattedCurrency = data?.map((token) => ({
    value: token.id,
    symbol: token.symbol,
    image: token.image,
    address: token.contract_address

  }));

   const getAllCurrency = () => formattedCurrency;

   return {
    getAllCurrency,
    error,
    isLoading 
  }

}
     

    
 

  




  
    
// export default useCountries;
// export const currency = tokenInfos.map(token => ({
//     value: token.id,
//     symbol: token.symbol,
//     image: token.image,
//     address: token.platforms.ethereum
//   }));


// const formattedCountries = countries.map((country) => ({
//     value: country.cca2,
//     label:country.name.common,
//     flag: country.flag,
//     latlng: country.latlng,
//     region: country.region
//   }));

//   const useCountries = () => {
//     const getAll = () => formattedCountries;;

//     const getByValue = (value: string) => {
//         return formattedCountries.find((item) => item.value == value)
//   }
//   return {
//     getAll,
//     getByValue
//   }
// }

