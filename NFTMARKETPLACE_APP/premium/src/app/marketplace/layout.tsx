import type { Metadata } from "next";
import NavBar from "../components/navbar/NavBar";









export const metadata: Metadata = {
  title: "thirdweb SDK + Next starter",
  description:
    "Starter template for using thirdweb SDK with Next.js App router",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   
         <>
      <header>
      <NavBar/>
     </header>
     { children}
       </>
  );
}
