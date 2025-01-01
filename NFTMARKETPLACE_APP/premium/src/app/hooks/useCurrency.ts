import {  useMemo, useCallback } from 'react';
import { contract } from '../contracts/getContract';

import { readContract, ZERO_ADDRESS } from 'thirdweb';

import useSWR from 'swr';
import { fetchCurrencyInfo } from '../utils/currency';





export const useCurrency = () => {
 

   
  const  datas  = readContract({
  contract,
  method: "getAllCurrency"
});





const currencyAddress = useMemo(() => ["0xdac17f958d2ee523a2206206994597c13d831ec7", 
  "0x6b175474e89094c44da98b954eedeac495271d0f", "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0"], []);

  const fetchCurrency = useCallback( async() => {
   const currency =  await Promise.all(currencyAddress.filter(addr => addr != ZERO_ADDRESS).map(fetchCurrencyInfo));
   return currency;
  
  }, [currencyAddress])

  const { data, error, isLoading } = useSWR("currency", fetchCurrency,
    {  
      revalidateOnReconnect: true, 
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false

    }
  )
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

   ;

   return {
    formattedCurrency,
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

