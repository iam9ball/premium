import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import Footer from "./components/Footer";
import CreateNftModal from "./components/modal/CreateNftModal";
import CreateListingModal from "./components/modal/CreateListingModal";
import {
  QueryClientProvider,
} from '@tanstack/react-query';
import { queryClient } from "./queryClient";
import WalletToast from "./components/WalletToast";
import Dialog from "./components/modal/Dialog";
import BuyListingModal from "./components/modal/BuyListingModal";







const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "thirdweb SDK + Next starter",
  description:
    "Starter template for using thirdweb SDK with Next.js App router",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} >
         
        <ThirdwebProvider>
          <QueryClientProvider client={queryClient}>
        {children}
        </QueryClientProvider>
        <CreateNftModal/>
        <CreateListingModal/>
         <Dialog body="Who are you buying this art for? if yourself, 'Click yes'."/>
      <BuyListingModal/>
        <Footer/> 
            <WalletToast/>

        </ThirdwebProvider> 
      </body>
      
    </html>
  );
}
