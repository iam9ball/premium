// import getCurrentUser from "@/app/actions/getCurrentUser";
// import getListingById from "@/app/actions/getListingById";
// import EmptyState from "@/app/components/EmptyState";
// import ListingClient from "./ListingClient";
// import { SafeUser } from "@/types";
// import { User } from "@prisma/client";
// import getReservation from "@/app/actions/getReservation";

import { fetchNFT, getListing } from "@/app/contracts/listingInfo";
import ListingDetails from "./ListingDetails";
import { getContract } from "thirdweb";
import { anvil } from "thirdweb/chains";
import { client } from "@/app/client";
import Container from "@/app/components/Container";


interface IParams {
  listingId: string;
}

export default async function ListingPage({ params }: { params: IParams }) {

  //try catch to return if listing id does not exist

  // let listing;
  // try {
  //  listing = await getListing(BigInt(params.listingId));
  // }
  // catch (error) {
  //   console.error(error);
  //   return;
  // }
  // const reservations = await getReservation(params);
  // const currentUser: User | SafeUser | null = await getCurrentUser();

  // if (!listing) {
  //   return <EmptyState />;
  // }

     
  return (
     
     
    <>
    <div className="h-[5vh]"></div>
     <section>
      <Container>
       <ListingDetails listingId={params.listingId}/>
       </Container>
     </section> 
     
    </>
  );
}
