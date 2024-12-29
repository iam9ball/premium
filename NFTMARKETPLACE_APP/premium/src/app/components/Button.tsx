'use client'

import { ConnectButton, useSwitchActiveWalletChain } from "thirdweb/react";
import { client } from "../client";
import { IconType } from "react-icons";
import { createWallet } from "thirdweb/wallets";
import styles from '../styles/ConnectButton.module.css';
import { anvil, polygonAmoy } from "thirdweb/chains";
import { useWindowWidth } from "@react-hook/window-size";
import { useMemo } from "react";

interface ButtonProps {
    actionLabel?: string;
    onClick?: () => void;   
    disabled?: boolean;
    variant?: 'connect';
    primaryConnect?: boolean;
    icon?: IconType;
    classNames?: string;
    defaultConnectButton?: boolean;
    
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
    primaryConnect,
    icon: Icon,
    classNames,
    defaultConnectButton
}: ButtonProps) {
  
  const width = useWindowWidth();
  const switchChain = useSwitchActiveWalletChain();
  
  const Width = useMemo(() => {
    if( primaryConnect) {return "100%"}
    if (width >= 1024) {
      return "160px";
    } else if (width >= 768) {
      return "144px";
    } else {
      return "112px";
    }
  }, [width]);

  const Height = useMemo(() => {
   
    if (width >= 768) {
    if( primaryConnect) {return "100%"}
      return "48px";
    }
    if( primaryConnect) {return "80%"}
    return "40px";
  }, [width]);

  const FontSize = useMemo(() => {
    if( primaryConnect) {return "10px"}
    if (width >= 768) {
      return "14px";
    }
    return "12px";
  }, [width]);

  const defaultConnectStyle = useMemo(() => {
    if (defaultConnectButton === true) {
      return styles.defaultConnectButton;
    }
    return styles.connectButton;
  }, [defaultConnectButton]);

  const handleConnect = () => {
    console.log("Connecting...");
    switchChain(polygonAmoy)
      .then(() => console.log("Switched to chain:", polygonAmoy))
      .catch((error) => console.error("Failed to switch chain:", error));
  };

  return (
    
    variant === "connect" ? (
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
          className: primaryConnect? "" : defaultConnectStyle,
          style: {
            color: primaryConnect ? "black":"white",
            minWidth: "96px",
            minHeight: "40px",
            width: Width,
            height: Height,
            fontSize: FontSize,
            padding: primaryConnect? "10px 14px" : "12px 16px",
            fontWeight: primaryConnect ? "900" : "500",
          },
          
        }}
        detailsButton={{
    style: {
      width: primaryConnect ? "50%" : "100%",
      borderRadius: `${primaryConnect && '0px'}`,
      fontSize: `${primaryConnect  && "8px"}`,
      padding: "1px 1px"
    },
  }}
        onConnect={handleConnect}
      />
    ) : (
      <button
        onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
        disabled={disabled}
        className={`relative disabled:opacity-70 disabled:cursor-not-allowed transition flex items-center justify-center cursor-pointer text-center ${classNames}`}
      >
        {Icon && (<Icon size={24} className="absolute left-4 top-3" />)}
        {actionLabel}
      </button>
    )
  );
}