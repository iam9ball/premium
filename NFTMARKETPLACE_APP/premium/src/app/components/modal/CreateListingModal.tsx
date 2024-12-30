'use client'
import useCreateListingModal from "@/app/hooks/useCreateListingModal"
import Modal from "./Modal";
import { useCallback, useMemo, useState, useRef } from "react";
import Heading from "../Heading";
import ToggleButton from "../ToggleButton";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import {createListing} from "@/app/contracts/listing";
import { useActiveAccount } from "thirdweb/react";
import CurrencySelect, { CurrencySelectValue } from "../CurrencySelect";
// import { Router } from "next/router";
import toast from "react-hot-toast";
import {showToast} from "../WalletToast";
import { useRouter } from "next/navigation";
import { NATIVE_TOKEN } from "@/app/utils/address";
import { getListingType } from "@/app/contracts/listingInfo";

// import { useListingFee, useListingInfo } from "../hooks/usePlatformInfo";



enum  STEPS {
    LISTINGPLAN,
    INFO
}

 enum LISTINGPLAN {
 
  BASIC,
  ADVANCED,
  PRO
  
}

const CreateListingModal = () => {
    const [isLoading, setIsLoading] = useState(false); 
    const createListingModal = useCreateListingModal();
    const account = useActiveAccount();
    const [listingPlan, setListingPlan] = useState<LISTINGPLAN>();
    const [step, setStep] = useState(STEPS.LISTINGPLAN);
     const [isReserved, setIsReserved] = useState(false);
    const [selectedValue, setSelectedValue] = useState<CurrencySelectValue> ();
     const { register, handleSubmit,  setValue, reset, formState: {errors} } = useForm({
    defaultValues: {
      listingPlan: null,
      assetAddress: "",
      assetId: null,
      assetPrice: null,
      currencyAddress: NATIVE_TOKEN,
      reserved: isReserved
    },
    mode: 'onSubmit',
    reValidateMode: "onSubmit"
  });
  //  const router = useRouter();

    const onBack = () => {
        setStep((value) => value - 1 )
    }

     const onSubmit: SubmitHandler<FieldValues> = (data) => {
      if (step !== STEPS.INFO) {
        return onNext();
      }
      
       console.log(data.currencyAddress);
        if (account) {
         const listingData = {
          assetAddress: data.assetAddress,
          assetId: data.assetId,
           currencyAddress: data.currencyAddress,
           assetPrice: data.assetPrice,
           listingPlan: data.listingPlan,
            reserved: data.reserved
         };

         if (!data.currencyAddress) {
          toast.error("Please select a currency");
          return;
         }
        
        setIsLoading(true);
       createListing(listingData, account).then((data) => {
        if(data.success){
          createListingModal.onClose();
          toast.success(data.message);
          reset();
          setListingPlan(undefined);
          setIsReserved(false);
          setSelectedValue(undefined);
          setStep(STEPS.LISTINGPLAN)
          createListingModal.mutateListings()  // force a soft refetching of listing
          
          console.log("refreshed")
        }
        else {
          toast.error(data.message);
        } 
        setIsLoading(false);
       });
        }
        else {  
           showToast();  
        //  connect wallet
        }

       
      
     };

     const onNext = () => {
      setStep((value) => value + 1);
     }


     const forwardLabel = useMemo(() => {

      if (step === STEPS.INFO) {
            return "Submit";
      }else {
        if (listingPlan == LISTINGPLAN.ADVANCED || listingPlan == LISTINGPLAN.PRO || listingPlan == LISTINGPLAN.BASIC) {
           return "Next";
        }
        else {
          return undefined;
        }
      }

          
     
     }, [step, listingPlan])

     const backwardLabel = useMemo(() => {

      if (step === STEPS.LISTINGPLAN) {
        return undefined;
      }
        return "Back"      
      
     }, [step])


      const setCustomValues = useCallback((key: any, value:any ) => {
        setValue(key, value, {
            shouldValidate: true,
            shouldDirty: true
          })
    }, [setValue])

    
    const basic = useMemo(async ()=> {
     const [duration, price] = await getListingType(LISTINGPLAN.BASIC);
     return {duration, price}
    }, [])  
    const advanced = useMemo(async ()=> {
     const [duration, price] = await getListingType(LISTINGPLAN.ADVANCED);
     return {duration, price}
    }, [])  
    const pro = useMemo(async ()=> {
     const [duration, price] = await getListingType(LISTINGPLAN.PRO);
     return {duration, price}
    }, [])  

  
     const handleToggle = (value: boolean) => {
     setIsReserved(value);
     setCustomValues("reserved", value);
    }
 
 
    
    const handleListingPlan = (type:LISTINGPLAN) => {
     setListingPlan(type);
     setCustomValues("listingPlan", type);

    }


   const handleCurrencySelect = (selectedOption: CurrencySelectValue | null) => {
  if (selectedOption) {
    // Set the currency field value to the entire selected option
    setSelectedValue(selectedOption);
    
    // Set the currency address field value
    setCustomValues("currencyAddress", selectedOption.address);
    console.log(selectedOption.address)
  } else {
    // Clear the values if no option is selected
   setSelectedValue(undefined);
    setCustomValues("currencyAddress", undefined);
  }
}

   
      let bodyContent;
      
      //TOKENTYPE
      {(step == STEPS.LISTINGPLAN) && (bodyContent = 



//         (
//     <div className="flex flex-col  gap-7">
//      <Heading
//      title="Choose Listing Plan"
     
//      />
//    <div className="flex justify-between space-x-3">
//       <div onClick={() => handleListingPlan(LISTINGPLAN.BASIC)} className={`${listingPlan == LISTINGPLAN.BASIC ? "bg-black text-white" : "border-gray-300"} flex-1 cursor-pointer rounded-lg border p-4 text-center`}> 
//         <div className="text-center">
//          <div className="md:text-lg text-sm font-bold">Basic</div>
//       <div className={`${listingPlan == LISTINGPLAN.BASIC && "text-white"} font-light text-neutral-500 mt-2 md:text-sm text-[10px]`}>$10</div>
//       <div className={`${listingPlan == LISTINGPLAN.BASIC && "text-white"} text-black font-semibold mt-1 md:text-sm text-[9px]`}>1 month</div>
//         </div>
//          </div>
//  <div onClick={() => handleListingPlan(LISTINGPLAN.ADVANCED)} className={`${listingPlan == LISTINGPLAN.ADVANCED ? "bg-black text-white" : "border-gray-300"} flex-1 cursor-pointer rounded-lg border p-4 text-center`}>   
//   <div className="text-center">
//          <div className="md:text-lg text-sm font-bold">Advanced</div>
//       <div className={`${listingPlan == LISTINGPLAN.ADVANCED && "text-white"} font-light text-neutral-500 mt-2 md:text-sm text-[10px]`}>$30</div>
//       <div className={`${listingPlan == LISTINGPLAN.ADVANCED && "text-white"} text-black font-semibold mt-1 md:text-sm text-[9px]`}>3 month</div>
//         </div>  
  
//      </div>
//  <div onClick={() => handleListingPlan(LISTINGPLAN.PRO)} className={`${listingPlan == LISTINGPLAN.PRO ? "bg-black text-white" : "border-gray-300"} flex-1 cursor-pointer rounded-lg border p-4 text-center`}>   
//   <div className="text-center">
//          <div className="md:text-lg text-sm font-bold">Pro{" "}</div>
//       <div className={`${listingPlan == LISTINGPLAN.PRO && "text-white"} font-light text-neutral-500 mt-2 md:text-sm text-[10px]`}>$50</div>
//       <div className={`${listingPlan == LISTINGPLAN.PRO && "text-white"} text-black font-semibold mt-1 md:text-sm text-[9px]`}>5 month</div>
//         </div>  
  
//      </div>
//      </div>
   
//     </div>
      
//   )
        
        
        
        
        
        (
       <div className="flex flex-col gap-6 ">
         <Heading title="Choose Listing Plan" subtitle="Select the listing plan of your choice" titleClassName="text-xl font-bold ml-4" subtitleClassName="font-light text-sm text-neutral-500 mt-1 ml-4"/>
   
        <div className="flex w-full justify-evenly items-center ">

          <div className={`border border-gray-300 w-[30%] rounded-lg py-4 px-2 cursor-pointer ${listingPlan == LISTINGPLAN.BASIC && ("bg-black text-white")}`} onClick={() => { handleListingPlan(LISTINGPLAN.BASIC)}}>
             <Heading title="Basic" subtitle={`$${basic.then((result) => result.price.toString()) }`} center titleClassName={`md:text-xl font-bold ${listingPlan == LISTINGPLAN.BASIC && ("text-white")}`} subtitleClassName={`text-xs md:text-base font-light mt-1 ${listingPlan == LISTINGPLAN.BASIC && ("text-white")}`}/>
              <div className={`flex items-center justify-center font-semibold text-xs md:text-lg mt-1 ${listingPlan == LISTINGPLAN.BASIC && ("text-white")}`}>
                        {basic.then((result) => result.duration.toString())}
              </div>
           </div>

           <div className={`border border-gray-300 w-[35%] rounded-lg py-5 px-2 cursor-pointer ${listingPlan == LISTINGPLAN.ADVANCED && ("bg-black text-white")}`} onClick={() => { handleListingPlan(LISTINGPLAN.ADVANCED)}}>
             <Heading title="Advanced" subtitle={`$${advanced.then((result) => result.price.toString()) }`} center titleClassName={`md:text-xl font-bold ${listingPlan == LISTINGPLAN.ADVANCED && ("text-white")}`}  subtitleClassName={`text-xs md:text-base font-light mt-1 ${listingPlan == LISTINGPLAN.ADVANCED && ("text-white")}`}/>
              <div className={`flex items-center justify-center font-semibold text-xs md:text-lg mt-1 ${listingPlan == LISTINGPLAN.ADVANCED && ("text-white")}`}>
                         {advanced.then((result) => result.duration.toString())}
              </div>
           </div>

           <div className={`border border-gray-300 w-[30%] rounded-lg py-4 px-2 cursor-pointer ${listingPlan == LISTINGPLAN.PRO && ("bg-black text-white")}`} onClick={() => { handleListingPlan(LISTINGPLAN.PRO)}}>
             <Heading title="Pro" subtitle={`$${pro.then((result) => result.price.toString()) }`} center titleClassName={`md:text-xl font-bold ${listingPlan == LISTINGPLAN.PRO && ("text-white")}`}  subtitleClassName={`text-xs md:text-base font-light mt-1 ${listingPlan == LISTINGPLAN.PRO && ("text-white")}`}/>
              <div className={`flex items-center justify-center font-semibold text-xs md:text-lg mt-1 ${listingPlan == LISTINGPLAN.PRO && ("text-white")}`}>
                        {pro.then((result) => result.duration.toString())}
              </div>
           </div>
            
                
            </div>
            </div>
       
     )
    
    ); }
      
     //INFO

     {(step == STEPS.INFO) && (bodyContent = (



      <div className="flex flex-col  gap-7">
       <div className="flex flex-col gap-4">
        <div className="flex flex-col ">
          <label htmlFor="assetContract" className="block text-xs md:text-sm font-medium text-gray-700">
                      Asset address
                    </label>
          <input type="text"  id="assetContract" className={`${errors.assetAddress ? "border-red-500" : "border-gray-300"} mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black placeholder:text-[13px]`} {...register("assetAddress", {
          required: true
        })} placeholder="0x123...789" />
          </div>
           
         <div className="flex gap-4">
                  <div className="flex-1">
          <label htmlFor="tokenId" className="block text-xs md:text-sm font-medium text-gray-700">
                      Token ID
                    </label>
          <input type="number" id="tokenId"  {...register("assetId", {
          required: true
        })} className={`${errors.assetId ? "border-red-500" : "border-gray-300"} mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black placeholder:text-[13px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} placeholder="0" />
 

       </div>
          

        <div className="flex-1">
          <label htmlFor="tokenPrice" className="block text-xs md:text-sm font-medium text-gray-700">
                      Token price
                    </label>
          <input type="number" id="tokenPrice"  {...register("assetPrice", {
          required: true,
        })} className={`${errors.assetPrice ? "border-red-500" : "border-gray-300"} mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black placeholder:text-[13px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} placeholder="0" />
 
      
        
          </div>
          </div>

       
         <CurrencySelect
          value={selectedValue}
          onChange={handleCurrencySelect}
         />
        
       
        
       
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-700">Reserve listing?</div>
          <div className="flex flex-end">
         <ToggleButton checked={isReserved} onChange={handleToggle}/>
         </div>
         </div>
       </div>
       
       </div>








      // <div className="flex flex-col  gap-6">
      //   <Heading title="Listing Details" subtitle="Enter information about your Listing" titleClassName="text-xl font-bold ml-4" subtitleClassName="font-light text-sm text-neutral-500 mt-1 ml-4"/>
       
      //  <div className="flex flex-col gap-4">
      //   <div className="flex flex-col gap-2">
      //     <label htmlFor="address" className="block text-sm font-black text-black">Asset Address</label>
      //     <input type="text" id="assetAddress" {...register("assetAddress", {
      //        required: true,
      //     })} className={`border ${errors.assetAddress ? "border-red-500" : "border-gray-300"}  rounded-lg p-2 w-full pl-6 placeholder:text-sm`} placeholder="0x123...789" />   
      //  </div>

      //   <div className="flex gap-2 justify-between items-center">
      //       <div className="flex flex-col w-[45%]">
      //     <label htmlFor="id" className="block text-sm font-black text-black">Asset Id</label>
      //     <input type="number" id="assetId" {...register("assetId", {
      //       required: true,
      //     })} className={`border ${errors.assetId ? "border-red-500" : "border-gray-300"} rounded-lg p-2 w-full placeholder:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} placeholder="0" />
      
      //  </div>
      //   <div className="flex flex-col w-[45%]">
      //     <label htmlFor="price" className="block text-sm font-black text-black">Asset Price</label>
      //     <input type="number" id="assetPrice" {...register("assetPrice", {
      //       required: true,
      //     })} className={`border ${errors.assetPrice ? "border-red-500" : "border-gray-300"} rounded-lg p-2 w-full placeholder:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} placeholder="0" />
      
      //  </div>
      //   </div>

      //    <CurrencySelect value={selectedValue} onChange={handleCurrencySelect}/>

      //   <div className="flex w-full justify-between">
      //         <p className="text-sm">Reserve listing?</p>
      //           <ToggleButton checked={isReserved} onChange={handleToggle}/>
      //  </div>  
        
       
      //  </div>
       
      //  </div>

     )
    
    
    ); } 


  return (
    <Modal
    isOpen={createListingModal.isOpen}
    onClose={createListingModal.onClose}
    forward={handleSubmit(onSubmit)}
    forwardLabel={forwardLabel}
    backwardLabel={backwardLabel}
    backward={onBack}
    title="Create a Listing"
    body={bodyContent}
    disabled={isLoading}
    />
  )
}

export default CreateListingModal;
