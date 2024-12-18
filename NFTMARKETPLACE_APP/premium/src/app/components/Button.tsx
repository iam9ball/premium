'use client'

import { ConnectButton } from "thirdweb/react";
import { client } from "../client";
import { IconType } from "react-icons";
import { createWallet } from "thirdweb/wallets";
import styles from '../styles/ConnectButton.module.css';

import {useWindowWidth} from "@react-hook/window-size";


interface ButtonProps {
    actionLabel?: string;
    onClick: () => void;   
    disabled?: boolean;
    variant?: 'connect';
    icon?: IconType;
    classNames?: string;
    defaultConnectButton?: boolean
}

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.trustwallet.app"),
  createWallet("com.coinbase.wallet"),
  createWallet("app.phantom"),
];



export default function Button({
    actionLabel, 
    onClick, 
    disabled, 
    variant,
    icon: Icon,
    classNames,
    defaultConnectButton
}: ButtonProps) {
  

  // Responsivity for connect button

   const width = useWindowWidth();
  
  const Width = () => {
    if (width >= 1024) {
      return "160px"
    }
    else if (width >= 768) {
      return "144px"
    }
    else {
      return "112px"
    }
    
  }

 const Height = () => {
    if (width >= 768) {
      return "48px"
    }
   
      return "40px"
  }

  const FontSize = () => {
    if (width >= 768) {
      return "14px"
    }
   
      return "12px"
  }

  const defaultConnectStyle = () => {
     if (defaultConnectButton == true) {
      return styles.defaultConnectButton;
     }
     return styles.connectButton;
  }


    return (
     (variant == "connect") ? (

 <ConnectButton
    
      client={client}
      wallets={wallets}
      connectModal={{
        size: "compact",
        title: "Connect wallet",
        showThirdwebBranding: false,
      }}
       connectButton={{
        label: "Connect",
        className:  (),

    style: {
     color: "white",
      minWidth: "112px",
      minHeight: "40px",
      width: Width(),
      height: Height(),
      fontSize: FontSize(),
      padding: "12px 24px",
      fontWeight: "500",
      
          
    },
  }}
    /> ) : (  
    <button
    onClick={e => { e.stopPropagation(); onClick()}}
    disabled={disabled}             
      className={`relative disabled:opacity-70 disabled:cursor-not-allowed transition flex items-center justify-center cursor-pointer  text-center 
      ${classNames}
      `}
    >
      {Icon && (<Icon size={24} className="absolute left-4 top-3"/>)}
      {actionLabel}
    </button>
     )
    )
    
    
    }

  





    
  

