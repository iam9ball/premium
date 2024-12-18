// import { useState, useEffect } from 'react';
// import { listings } from "../contracts/platformInfo";
// import { downloadFile } from "../contracts/downloadFile";



// export function useFetchListings() {
//   const [formattedListings, setformattedListings] = useState<any>();
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);

//   useEffect(() => {
    
//     async function fetchListingsAndFiles() {
//       try {
//         // First, fetch listings
//         const fetchedListings = await listings();
       

//         // Then download files for each listing
//        setformattedListings(fetchedListings.map(async (listing) => ({
//           ...listing,
//           file : await downloadFile(listing.tokenId, listing.assetContract)     
//         })));

        
       
        
//         setIsLoading(false);
//       } catch (fetchError) {
//         setError(fetchError instanceof Error ? fetchError : new Error('Unknown error'));
//         setIsLoading(false);
//       }
//     }

//     fetchListingsAndFiles();
//   }, []);

//   return { 
    
//     formattedListings,
//     isLoading, 
//     error 
//   };
// }