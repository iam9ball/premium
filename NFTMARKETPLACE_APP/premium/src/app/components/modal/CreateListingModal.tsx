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
      {(step == STEPS.LISTINGPLAN) && (bodyContent = (
       <div className="flex flex-col gap-6 ">
         <Heading title="Choose Listing Plan" subtitle="Select the listing plan of your choice" titleClassName="text-xl font-bold ml-4" subtitleClassName="font-light text-sm text-neutral-500 mt-1 ml-4"/>
   
        <div className="flex w-full justify-evenly items-center ">

          <div className={`border border-gray-300 w-[30%] rounded-lg py-4 px-2 cursor-pointer ${listingPlan == LISTINGPLAN.BASIC && ("bg-black text-white")}`} onClick={() => { handleListingPlan(LISTINGPLAN.BASIC)}}>
             <Heading title="Basic" subtitle="$10" center titleClassName={`text-xl font-bold ${listingPlan == LISTINGPLAN.BASIC && ("text-white")}`} subtitleClassName={`font-lightmt-1 ${listingPlan == LISTINGPLAN.BASIC && ("text-white")}`}/>
              <div className={`flex items-center justify-center font-semibold text-lg mt-1 ${listingPlan == LISTINGPLAN.BASIC && ("text-white")}`}>
                        1 month
              </div>
           </div>

           <div className={`border border-gray-300 w-[30%] rounded-lg py-5 px-2 cursor-pointer ${listingPlan == LISTINGPLAN.ADVANCED && ("bg-black text-white")}`} onClick={() => { handleListingPlan(LISTINGPLAN.ADVANCED)}}>
             <Heading title="Advanced" subtitle="$30" center titleClassName={`text-xl font-bold ${listingPlan == LISTINGPLAN.ADVANCED && ("text-white")}`}  subtitleClassName={`font-lightmt-1 ${listingPlan == LISTINGPLAN.ADVANCED && ("text-white")}`}/>
              <div className={`flex items-center justify-center font-semibold text-lg mt-1 ${listingPlan == LISTINGPLAN.ADVANCED && ("text-white")}`}>
                        3 months
              </div>
           </div>

           <div className={`border border-gray-300 w-[30%] rounded-lg py-4 px-2 cursor-pointer ${listingPlan == LISTINGPLAN.PRO && ("bg-black text-white")}`} onClick={() => { handleListingPlan(LISTINGPLAN.PRO)}}>
             <Heading title="Pro" subtitle="$50" center titleClassName={`text-xl font-bold ${listingPlan == LISTINGPLAN.PRO && ("text-white")}`}  subtitleClassName={`font-lightmt-1 ${listingPlan == LISTINGPLAN.PRO && ("text-white")}`}/>
              <div className={`flex items-center justify-center font-semibold text-lg mt-1 ${listingPlan == LISTINGPLAN.PRO && ("text-white")}`}>
                        5 months
              </div>
           </div>
            
                
            </div>
            </div>
       
     )); }
      
     //INFO

     {(step == STEPS.INFO) && (bodyContent = (
      <div className="flex flex-col  gap-6">
        <Heading title="Listing Details" subtitle="Enter information about your Listing" titleClassName="text-xl font-bold ml-4" subtitleClassName="font-light text-sm text-neutral-500 mt-1 ml-4"/>
       
       <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="address" className="block text-sm font-black text-black">Asset Address</label>
          <input type="text" id="assetAddress" {...register("assetAddress", {
             required: true,
          })} className={`border ${errors.assetAddress ? "border-red-500" : "border-gray-300"}  rounded-lg p-2 w-full pl-6 placeholder:text-sm`} placeholder="0x123...789" />   
       </div>

        <div className="flex gap-2 justify-between items-center">
            <div className="flex flex-col w-[45%]">
          <label htmlFor="id" className="block text-sm font-black text-black">Asset Id</label>
          <input type="number" id="assetId" {...register("assetId", {
            required: true,
          })} className={`border ${errors.assetId ? "border-red-500" : "border-gray-300"} rounded-lg p-2 w-full placeholder:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} placeholder="0" />
      
       </div>
        <div className="flex flex-col w-[45%]">
          <label htmlFor="price" className="block text-sm font-black text-black">Asset Price</label>
          <input type="number" id="assetPrice" {...register("assetPrice", {
            required: true,
          })} className={`border ${errors.assetPrice ? "border-red-500" : "border-gray-300"} rounded-lg p-2 w-full placeholder:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} placeholder="0" />
      
       </div>
        </div>

         <CurrencySelect value={selectedValue} onChange={handleCurrencySelect}/>

        <div className="flex w-full justify-between">
              <p className="text-sm">Reserve listing?</p>
                <ToggleButton checked={isReserved} onChange={handleToggle}/>
       </div>  
        
       
       </div>
       
       </div>

     )); } 


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