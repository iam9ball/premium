'use client'
import Button from '@/app/components/Button';
import Pulse from '@/app/components/Pulse';
import { ipfsToHttp } from '@/app/utils/ipfsToHttp';
import Image from 'next/image';
import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import useDialog from '@/app/hooks/useDialog';
import useBuyListingModal from '@/app/hooks/useBuyListingModal';
import { fetchNFT, getListing } from '@/app/contracts/platformInfo';
import { getContract } from "thirdweb";
import { anvil } from "thirdweb/chains";
import { client } from "@/app/client";
import useSWR from 'swr';
import { NFT } from 'thirdweb/react';


interface ListingDetailsProps {
  listingId: string;
}

export default function ListingDetails(
  {listingId}: ListingDetailsProps
) {

    const dialog = useDialog();
  const buyListingModal = useBuyListingModal();


   const fetchListing = useCallback(async () => {
    try {
      const listing = await getListing(BigInt(listingId));

      const contract = getContract({
        client,
        chain: anvil,
        address: listing.assetContract,
      });

      const nft = await fetchNFT(contract, listing);

      return {
        ...listing, 
        nft: nft || null
      };
    } catch(error) {
      console.error('Error fetching listing:', error);
      throw error;
    }
  }, [listingId]);

  // Use SWR with optimized configuration
  const { 
    data, 
    error,
    mutate,
  } = useSWR('listings/' + listingId, fetchListing, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true
    });


const rotationStyle = useMemo(() => {
  const rotation = 132;
  return { backgroundImage: `linear-gradient(${rotation}deg, #5ddcff, #3c67e3 43%, #4e00c2)` 
};
}, [])

 const handleMouseEnter = useCallback(() => {
   buyListingModal.setListingId(data?.listingId!)
  }, [buyListingModal, data?.listingId]) 
    
  const listingStatus = useMemo(() => {
    switch (data?.status) {
      case 0:
       
        return "Inactive";
      case 1:
       
        return "Active";
      case 2:
        
        return "Sold";
       case 3:
        
        return "Cancelled";
    }
  }, [data?.status])

  const tokenType = useMemo(() => {
    switch (data?.tokenType) {
      case 0:
       
        return "ERC721";
      case 1:
        return "ERC1155";
       
    }
  }, [data?.tokenType])


 const isAnimating = useMemo(() => {
   return !(data?.status != 1)
   }, [data?.status])



  const endTime = useMemo(() => {
    console.log(Number(data?.endTimestamp));
    console.log(Number(data?.startTimestamp));
   const time =  Math.floor((Number(data?.endTimestamp) - Number(data?.startTimestamp)) / 86400);
   return time;
  }, [data?.endTimestamp, data?.startTimestamp])


  const onClick = () => {
    dialog.onOpen();
   
  }


   


  
  if(error) {
    return <div>An error occured</div>
  }

  if (!data) {
    return <div>No listing found</div>
  }



  return (
    

    <>
    <div className="w-full aspect-[3/4] h-[80vh] cursor-pointer flex justify-evenly " onMouseEnter={handleMouseEnter}>
      <div className="relative h-full w-[90%] group">
        {/* Background gradient animation */}
        <div
          className="absolute top-[-1%] left-[-2%] w-[104%] h-[102%] rounded-lg z-[-1]"
          style={{
            ...rotationStyle,
          }}
        />
        
        {/* Blur effect */}
        <div
          className="absolute top-[calc(65vh/6)] left-0 right-0 w-full h-full mx-auto z-[-1] scale-80 opacity-100 transition-opacity duration-500 blur-[calc(65vh/6)]"
          style={{
            ...rotationStyle,
          }}
        />
       <div className="w-full flex justify-evenly items-center h-[100%]">
        {/* Main card content */}
        <div className="relative w-[40%] flex items-center h-[90%]">
          
            <Image 
              src={
                ipfsToHttp(data?.nft!.metadata.image!)
              } 
              alt={
                data?.nft!.metadata.name!
              } 
              fill
              style={{ objectFit: 'contain' }}
              className="rounded-lg transition-transform duration-300 group-hover:scale-95"
              sizes="(max-width: 640px) 40vw,
                     60vw"
              priority
            />
         

          </div>

            <div className='w-[40%] flex-col items-center h-[90%]'> 
               <div className ='relative w-full h-full'> 
                <div className="absolute top-[1%] left-[1%] w-full h-full">
                  <div className='w-full h-full flex items-center '>
                    <div className='flex-col'>
                        <div className='flex items-center mb-6'>
                         <Pulse isAnimating={isAnimating}/>
                         <span className = "text-gray-300 ml-3 capitalize ">{listingStatus}</span>
                         </div>
                         

                    <div className="font-semibold text-white text-3xl">
                      <div className="capitalize tracking-wide mb-6">
                        {data?.nft!.metadata.name} <span className=''>#{data?.tokenId.toString()}</span>
                      </div>
                    </div> 
                    
                    <div className="font-semibold  mb-6">
                      <span className='text-gray-300 tracking-wide text-xl'> Listed by: {" "}</span>
                      <span className="capitalize tracking-wider text-white">
                       {data?.listingCreator}
                      </span>
                    </div> 
                    <div className="font-semibold  text-xl tracking-wide mb-6">
                      <span className='text-gray-300'> Price: {" "}</span>
                      <span className="capitalize text-white">
                      {data?.pricePerToken.toString()}
                      </span>
                    </div> 
                    { data?.reserved && <div className="font-semibold mb-6">
                      <span className='text-gray-300 text-xl tracking-wide'>Reserved</span>
                      
                    </div>} 
                            <div className='flex mb-6'>
                              <Button  actionLabel="Make Offer" 
                              classNames="bg-white text-[16px] px-5 py-3 sm:px-10 sm:py-4 rounded-lg " onClick={()=>{}}/>
                              <Button  actionLabel="Buy Listing"  
                              classNames="bg-black text-[16px] text-white px-5 py-3 sm:px-10 sm:py-4 ml-8 rounded-lg" onClick={onClick}/>
                            </div>

                            <div>
                              <span>🕓</span>
                              <span className='text-white ml-7 '>{endTime} days left</span>
                            </div>
                       </div>
                    </div>
                </div>
            
            </div> 
            </div>
      
      </div>
    </div>
     </div>

      <div className="h-[100vh] flex justify-center items-center">
         <div className='border-gray-400 border-2 h-[80vh] w-[90%] rounded-lg'>
          
          <div className='flex w-full h-full justify-evenly items-center'>
              <div className="w-[30%] border-gray-400 border-2 h-[80%] rounded-lg p-2">
                <div className='w-full border-gray-400 border-b-2 text-center text-xl'>Details</div>
                <div className="w-full h-full flex-col items-stretch">
                  <div className='w-full h-[25%] border-gray-400 border-b-2 '>Asset Contract: <span className='text-sm'>{data?.assetContract}</span></div>
                  <div className='w-full h-[25%] border-gray-400 border-b-2 '>Asset Id: <span className='text-sm'>#{data?.tokenId.toString()}</span> </div>
                  <div className='w-full h-[25%] border-gray-400 border-b-2 '>Asset Standard: <span className='text-sm'>{tokenType}</span></div>
                  <div className='w-full h-[25%]'>Royalty: <span className='text-sm'>10%</span></div>
                </div>

             </div>

             <div className="w-[50%] border-gray-400 border-2 h-[80%] rounded-lg break-words overflow-y-auto p-2">
                <div className='w-full border-gray-400 border-b-2 text-center text-xl'>Description</div>
                {data?.nft?.metadata.description}
                {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed sapiente illum necessitatibus ut? Repudiandae repellat ad eligendi voluptas ut doloribus voluptatem, eius blanditiis quaerat iste dolor ab itaque optio debitis?
                Maxime deleniti nesciunt ab maiores eius, cum dicta quia voluptatum dignissimos perspiciatis mollitia aliquid quas neque doloribus illum ea. Quia unde ab qui earum labore, voluptate maiores animi excepturi mollitia.
                Libero vel nobis quam error quia consequuntur corrupti modi sunt itaque doloribus dolore similique officia sapiente dolores fugiat, harum assumenda velit necessitatibus quas minus nulla at autem ipsam qui? Quasi?
                Ex necessitatibus accusantium, at incidunt saepe vel impedit nulla mollitia delectus amet doloribus nostrum sit quos temporibus quod veniam labore? Iste id ipsum excepturi tenetur. Iusto eligendi nulla dignissimos at?
                Harum similique, dolor explicabo nesciunt pariatur delectus? Enim ducimus, officia quis delectus asperiores quisquam, quo vel quibusdam accusamus a ab. Consequatur quod, qui itaque quibusdam laborum atque voluptatibus ut recusandae.
                Iste dolorum blanditiis sed voluptatibus! Accusantium ipsum culpa labore, mollitia non doloribus tempora vitae nam error. Non quasi molestiae laborum sapiente harum error tempore? Architecto officiis libero ipsum perferendis deleniti?
                Voluptatibus iusto mollitia rerum laboriosam, iste modi corporis recusandae nihil dolor temporibus dicta? Rerum eligendi corrupti eaque, facilis recusandae odio illum inventore voluptates, assumenda, illo quaerat non iste voluptas necessitatibus.
                Doloribus dolores repellat dolorum voluptatibus expedita vero corrupti, ab consequatur quaerat ut harum iusto placeat veritatis inventore eaque soluta aspernatur qui! Accusantium asperiores quam quo repellat tempora. Magnam, quaerat tenetur?
                Voluptas ex aliquid soluta minima, aspernatur similique culpa mollitia? Et porro mollitia omnis, aperiam illum esse rerum iure? Officiis dolores officia dolorum eveniet, natus quaerat temporibus veniam odio illo cum.
                Rem nesciunt, esse quia illum non repudiandae iusto asperiores nobis hic porro facere. Laborum sapiente nulla suscipit, aperiam deserunt obcaecati optio, tenetur laudantium sequi nemo magni! Sint nemo facere expedita.
                Sed mollitia aspernatur velit! Id illo aliquam pariatur totam nulla nobis corporis nisi consequuntur ratione nostrum culpa eligendi unde temporibus consequatur, incidunt, qui voluptates sint ipsa. Nobis natus doloremque veniam?
                Dignissimos blanditiis tenetur dicta veniam vel debitis distinctio nesciunt nobis quod commodi, harum mollitia ipsum perspiciatis, ut corrupti soluta provident porro itaque ab, voluptas incidunt quam aliquam facilis praesentium. Eius.
                Quibusdam aspernatur dolorum totam reprehenderit, eveniet sequi tenetur dolorem nesciunt odit blanditiis deserunt alias. Facilis, adipisci iure. Tenetur accusantium ipsum quae aperiam! Dolor vitae porro laborum vero sint ipsam at.
                Tenetur asperiores quisquam quaerat suscipit possimus debitis molestias pariatur minima laudantium impedit facere cupiditate sed perspiciatis illum ad laborum nostrum repellendus non maxime, voluptatem cumque optio? Dignissimos eum explicabo neque?
                Beatae nihil unde necessitatibus sunt! Aspernatur nisi corporis tempore labore saepe iusto, quis impedit aperiam optio itaque est autem aut quibusdam vel cum iure eos maiores in ipsa error ex!
                Cupiditate rerum libero distinctio architecto repellendus recusandae maiores quo minima! Fugit dolores illum expedita, numquam consequatur, dolore voluptates itaque atque tempora at dicta eos unde quidem totam, nulla aperiam ipsam.
                Aspernatur harum dicta accusantium possimus ea reprehenderit illum adipisci quas quibusdam rem qui illo magni similique architecto atque in quos minus, dolorum perspiciatis necessitatibus repellat. Molestias dolorum suscipit voluptas sapiente!
                Nostrum consequuntur atque perspiciatis assumenda ut eaque unde minus quibusdam laborum expedita, ducimus reiciendis, error debitis vel officiis, vero quos adipisci repudiandae itaque explicabo nobis. Doloribus, accusamus perspiciatis. Sint, blanditiis!
                Ut laudantium earum iusto delectus harum fugit obcaecati eum mollitia assumenda sint illum qui, animi ducimus autem suscipit fuga modi deleniti accusantium amet id! Et labore alias possimus magnam soluta.
                Eveniet temporibus nemo veniam, maiores totam ducimus sint cupiditate porro fugiat repellendus pariatur iure libero dolor ipsam, quaerat molestias nesciunt. Iusto dolorum, totam hic nisi error praesentium molestiae commodi labore.
                Similique maiores nostrum eos nobis, molestias deleniti quae! Illum vel veniam, ex consequuntur laudantium aperiam perferendis vero reprehenderit expedita omnis magnam assumenda aliquam? Dolorem laborum deserunt unde, eveniet nobis eligendi.
                Distinctio, voluptates magnam, necessitatibus totam id maiores praesentium vel, nihil numquam eos accusamus suscipit sed eaque aliquid cumque fugiat eligendi rerum voluptatibus error vitae provident! Nihil eligendi dignissimos illum quisquam?
                Quidem, distinctio odio dolores ea dolorem provident ipsam quibusdam id est dignissimos officiis in accusamus natus dolorum perferendis saepe voluptatum aliquid, at harum eveniet, vel suscipit ipsum laudantium! Libero, aspernatur.
                Eos commodi totam voluptatum molestias consequuntur saepe vel, numquam alias perspiciatis illo impedit harum, aspernatur quo iure at, vitae distinctio facilis. Optio repellat dicta aperiam ab, maxime qui sed quis.
                Possimus iure itaque quis libero ab sapiente ratione! Aut asperiores alias quidem ea, officiis nesciunt ducimus tenetur, libero voluptatum fugiat cum rerum mollitia odit nostrum voluptate eum odio. Doloremque, placeat!
                Rerum quis inventore at laudantium recusandae eius quibusdam, saepe sapiente sint reprehenderit similique quo eveniet fugiat nulla atque, minus blanditiis? Adipisci assumenda doloremque veniam sed exercitationem, voluptatum porro aperiam repellat.
                Et earum eveniet delectus corrupti, enim vero natus temporibus doloremque. Nam soluta veniam cum repudiandae nihil consequuntur rem. Eum labore, error aut placeat accusantium natus adipisci ea nostrum nobis quisquam.
                Repudiandae cupiditate reiciendis at accusantium ipsum. Quo quos blanditiis fuga. Cum, eum! Rerum quidem officiis itaque consectetur magni ratione ad soluta maiores excepturi repellat nesciunt, fugit error dolore porro. Neque.
                Odio libero perspiciatis accusamus at consequatur dolore illum hic soluta aut, animi error quod dolores qui ullam consectetur maxime tempora iure. Quo fugiat voluptatibus laudantium amet doloribus. Eum, quisquam voluptas.
                Laudantium error molestiae in, corrupti saepe aperiam sit, unde tempore pariatur dolores voluptatum dolore nulla vero dolorem dolorum recusandae placeat? Doloremque, est suscipit! Dolorem rerum neque temporibus voluptatum quasi esse?
                Ab maiores nihil aspernatur dolore itaque eligendi, enim voluptatum, voluptas rem animi accusantium modi doloribus aliquid eaque provident vitae? Quibusdam dignissimos corporis eligendi nesciunt exercitationem harum, a iusto placeat mollitia.
                Laudantium voluptatibus at et, iusto amet quaerat facilis, illum a laborum deleniti adipisci accusamus, dolorem beatae. Perspiciatis corporis deserunt adipisci ad, impedit, enim amet, aperiam iste optio harum explicabo minima!
                Quibusdam at tenetur sed excepturi facilis numquam aperiam labore libero repellat fugit unde necessitatibus, nesciunt laudantium hic debitis ipsum, sint dolores eum! Accusantium reiciendis nemo non reprehenderit quisquam quos blanditiis!
                Perferendis natus quod rem in sit ratione repudiandae, pariatur minus magni tempore earum odit impedit architecto excepturi quis. Reprehenderit doloribus ad repellat eum? A mollitia, aspernatur neque nobis animi corrupti!
                Placeat earum tempore fuga culpa sapiente dolore aliquam sint distinctio quibusdam, ipsum fugiat praesentium, repudiandae ducimus odio ipsa animi natus, expedita molestias. Laboriosam, officia quidem eveniet temporibus sint officiis mollitia!
                Illo alias laboriosam unde officiis voluptatum iure provident accusamus, cumque magnam odio. Voluptatum soluta sequi consectetur nisi sit tenetur explicabo neque nesciunt molestias culpa est, obcaecati animi recusandae! Nemo, eum?
                Distinctio, numquam! Aperiam quia dolore dolores sequi molestiae excepturi natus, ab fugit voluptatibus, distinctio placeat recusandae vero? Eveniet repellendus dicta eius? Distinctio magni sunt veritatis nostrum quia dicta ea quas!
                Illo illum repudiandae, repellat quidem esse, nihil libero velit eveniet officiis sunt, quasi totam excepturi fugiat minima ipsum quae non odio! Facilis voluptatibus ab maiores officiis explicabo dolorem praesentium omnis.
                Repudiandae autem est corrupti ad facere nihil, aut deleniti iusto laudantium consequatur voluptates libero distinctio tempora fugiat? Impedit ut, magni, corporis reprehenderit, iure eius eaque id cum possimus dolor corrupti.
                Ad aspernatur veniam consectetur laudantium accusantium quo quasi? Odit hic iure neque eligendi, nesciunt laborum itaque. Ratione, omnis repellat facilis corrupti eius expedita pariatur quidem perferendis ducimus! Rem, mollitia quia?
                Quod voluptatum perferendis ex delectus, fugit, laudantium unde fugiat, sapiente suscipit pariatur eum placeat praesentium! A nam pariatur quis, est voluptatibus voluptatum fugiat placeat velit similique quibusdam illum illo et?
                Deleniti sapiente architecto blanditiis totam nostrum officia quae odit accusantium eaque repellat obcaecati, in, omnis quo laudantium numquam reprehenderit cupiditate quasi soluta distinctio! Illo assumenda inventore, vitae similique iste blanditiis.
                Amet libero id velit dicta dolor magnam exercitationem molestias doloribus molestiae consequatur, animi hic ducimus. Molestias voluptates dicta necessitatibus magni nesciunt dolor, sapiente praesentium quidem saepe. Magni eaque odio voluptas.
                Debitis dolore optio, officia, voluptatem necessitatibus exercitationem placeat rem, laborum maiores magni architecto nihil! Totam dolor sed cumque perferendis eum sunt animi nobis. Provident sint, aperiam ex ea hic eius!
                Nobis molestias omnis, illum repudiandae molestiae recusandae magnam. Facilis ex, aspernatur dolorum nihil earum culpa eveniet inventore ratione, optio doloremque rerum voluptatem odit quibusdam non. Ducimus praesentium sequi similique aut.
                Harum voluptates reiciendis delectus maiores nesciunt, corporis asperiores veritatis, officiis, tempore deleniti nobis non ea aperiam commodi voluptatem alias autem temporibus. Debitis voluptatibus dicta officiis numquam ipsam iusto ratione nihil!
                Reprehenderit nisi repellendus facilis hic culpa quod nulla quibusdam omnis necessitatibus nostrum est sed ipsum numquam deserunt repellat vitae earum dolor officia perspiciatis provident, eos alias cupiditate fugit. Earum, fugit?
                Illum ut minus consequatur eius repellat officia accusantium alias nisi quasi neque fugit sequi eveniet amet reiciendis praesentium, suscipit earum accusamus natus modi? Eaque molestiae earum ad expedita itaque voluptatem.
                Cum autem, fugit officia aut eaque, blanditiis nisi dicta aliquid, a rem cupiditate architecto laborum hic natus. Dignissimos facilis eveniet laboriosam quibusdam eius ullam labore nihil, quam quis amet sint.
                Repellendus nisi aspernatur fugit quod magnam consectetur voluptate? Molestiae autem hic ipsa exercitationem, velit enim vel ipsum cumque impedit magni voluptatibus quasi quae obcaecati facilis quidem optio maiores ipsam aliquam!
                Temporibus rem iure eum ipsum exercitationem, inventore nesciunt consequuntur consectetur facilis quia est nihil architecto a placeat illo dolores eveniet quas possimus itaque corporis omnis illum, ullam, officia laborum? Sapiente.
                Quis deserunt, laborum repellendus consequuntur eveniet omnis itaque hic beatae quo animi minima porro nemo eum minus blanditiis. Earum commodi blanditiis quaerat excepturi ipsum consectetur, molestiae dolorum et? Minima, ipsam?
                Repellendus aut dolore aspernatur dolorem voluptas culpa odio pariatur nihil, aliquam enim voluptatibus esse iure perspiciatis non. Aliquam deserunt inventore reiciendis! Placeat mollitia sapiente quod doloribus, et iste doloremque necessitatibus?
                Quae natus architecto voluptates repellat unde, illum dolorum cupiditate impedit quasi ipsum, veritatis dicta corporis pariatur consectetur eos beatae. Velit exercitationem ullam dolorum hic aliquid fuga harum expedita quos recusandae.
                Accusamus officiis sit odio vero nostrum et! Doloribus deleniti assumenda, maxime, officia quidem tempora tenetur adipisci praesentium unde quisquam delectus modi quae pariatur deserunt voluptatem sequi et quibusdam laborum nam?
                Tenetur corporis nisi omnis in nobis ab libero enim sunt praesentium dolor sint, neque odio magni deleniti debitis repudiandae quod consequatur earum voluptate quia provident veritatis quam molestiae ea. Quas.
                Vero repellat sequi aliquam iure mollitia necessitatibus optio velit explicabo exercitationem, fugit obcaecati magni dignissimos architecto illum non ad quam sunt amet nisi aliquid fuga minima iusto fugiat qui? Qui?
                A beatae aliquam soluta sunt cupiditate harum? Id a ipsum, sed nam corporis, sint excepturi vero modi tenetur odit animi perspiciatis molestias, sapiente quibusdam neque nostrum iusto nisi! Molestias, reprehenderit?
                Soluta, facilis molestias. Pariatur qui nihil natus accusamus. Quisquam quod possimus dolorum molestias, amet non, libero vel quis corporis alias voluptates nisi! Alias deserunt soluta explicabo assumenda error iste eos.
                Facere sint aliquam vitae facilis inventore quaerat eos dolorem fugiat blanditiis laboriosam deleniti ad odio, officia illo ducimus totam. Dicta libero mollitia excepturi, cum distinctio eum rem? Repellendus, soluta consequuntur!
                Delectus repellendus vero totam qui nam fugiat distinctio ea tempore? Quas, quasi. Incidunt illum facere explicabo iure. Facilis, magni quod corrupti nisi dolorem soluta laudantium maxime modi excepturi, quae blanditiis.
                Corporis veritatis, amet sapiente maiores deserunt mollitia earum ex quia doloribus officia! Deleniti impedit voluptas consequatur, sapiente repellendus, ea eum, commodi vitae id sit pariatur. Assumenda aut pariatur ea totam.
                Nulla sequi inventore sunt distinctio assumenda quam consequuntur deleniti tempore vitae nobis dolor, consequatur obcaecati sed fugit dignissimos enim voluptates. Blanditiis modi debitis alias voluptatibus cumque consequatur laudantium harum laboriosam.
                Asperiores rem at perspiciatis maxime. Accusantium ipsam tempora qui. In magni fuga ab itaque velit labore est corporis saepe sed veniam impedit debitis beatae nisi error, culpa aliquam alias cumque?
                Explicabo exercitationem harum voluptatum dolorem modi nihil suscipit quibusdam vero, facere voluptate rerum repellendus tenetur dolore eius earum labore odit consequuntur voluptatem voluptatibus ratione illo ad in quasi repellat. Totam?
                Animi necessitatibus earum optio nemo possimus. Voluptates impedit tempora perspiciatis illum cupiditate omnis voluptate modi suscipit sapiente, exercitationem qui temporibus possimus aliquam quam dolor iste repudiandae officiis? Aliquam, quis harum.
                Architecto aperiam autem sit veniam cumque recusandae quam quia inventore molestias, numquam ut accusantium velit fuga suscipit nostrum in eum! Unde, eligendi excepturi! Inventore reiciendis laboriosam veniam debitis. Ducimus, voluptatem.
                Suscipit quaerat veniam nulla fuga ducimus eligendi provident ipsam ex voluptatibus quos facere, cupiditate eum. Voluptatum reprehenderit, repellat nisi cumque dignissimos dolore modi itaque quasi quod, omnis cupiditate obcaecati necessitatibus?
                Suscipit eius at consectetur commodi labore inventore, unde earum? Ratione, quo totam harum reiciendis dolore assumenda laborum magni commodi dolores laboriosam rem mollitia vel inventore maiores voluptatum tenetur veniam in.
                Quia sequi repudiandae quos eveniet inventore accusantium aut voluptates illo aspernatur distinctio, natus quae perferendis amet, eos tempore molestias sint ipsam. Eligendi quisquam officia consequatur accusantium dignissimos cupiditate deserunt praesentium?
                A maxime similique eos cumque corporis beatae totam magni pariatur, obcaecati, illo quas neque, nostrum nam reprehenderit. Tenetur, ducimus quo! Soluta impedit dicta nobis neque vero dolor molestias fugit quae!
                Vitae, ea odio vero consequuntur, cupiditate aliquam fuga exercitationem qui nulla quae dolores optio sint fugit nobis explicabo? Officiis ex illo alias veniam consequuntur, nisi velit necessitatibus blanditiis quae officia?
                Enim in rerum excepturi animi quod tempore, aliquid vero laudantium et iure architecto adipisci odit neque, optio fugiat voluptates exercitationem similique, non tempora eius aspernatur! Ipsam distinctio fugit consequuntur assumenda.
                Impedit facere nihil, error minus laborum dolorem consectetur praesentium laboriosam perferendis dignissimos fugit beatae voluptatum. Beatae provident debitis porro corrupti. Aliquid ut, eveniet libero inventore maxime enim laboriosam minima aut?
                Quidem odio porro nihil ullam inventore nam, soluta minima quisquam, corrupti ducimus exercitationem incidunt vero similique suscipit laborum rem, quos ipsa praesentium ipsum! Quam eveniet sint magni vero corrupti consequatur?
                Quasi earum odit in, sunt doloribus velit at cumque ex saepe, voluptates commodi temporibus aliquid fugit quas suscipit officia? Quos pariatur quo doloremque exercitationem porro nobis sapiente nemo accusamus natus?
                Vitae maxime voluptate voluptatem expedita eum, deserunt necessitatibus perferendis iure voluptates suscipit repellendus eligendi, sit optio atque reprehenderit saepe omnis. Dolorem atque exercitationem commodi dolor doloremque praesentium qui aliquam tempore.
                Pariatur maxime repellat quaerat cupiditate dolorem, quae reprehenderit provident sit amet dolorum quasi, delectus maiores adipisci cum eius tempora quos et temporibus iure deleniti quo facere eum ex nihil! Maxime?
                Eius iure ullam consectetur ducimus rerum libero perspiciatis illo vero error optio, corrupti eveniet expedita esse asperiores aliquid consequuntur nam omnis assumenda doloremque iusto nisi aut. Molestiae perferendis fugiat id!
                Aliquid autem vero facilis cupiditate quibusdam voluptatum praesentium molestias asperiores rem vitae, sequi in quia maiores deleniti ratione corrupti inventore atque et. Vero facilis distinctio enim ex fugiat magni pariatur.
              */}
             </div>
          </div>

         </div>    
      </div>
      </>
  );
}
