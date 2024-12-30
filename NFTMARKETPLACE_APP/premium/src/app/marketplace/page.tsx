


import CardContainer from "../components/card/CardContainer";
import Listings from "./Listings"



export default  function Marketplace() {
 
  return (
   
    <>
   
     <div className="h-20"></div>
     <section className="h-[90vh]">
      <CardContainer>
      <Listings/>
      </CardContainer>
     </section> 
     
    </>
  )
}
