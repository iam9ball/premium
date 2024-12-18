"use client";
import { useCurrency } from "../hooks/useCurrency";
import Image from "next/image";
import Select from "react-select";
import { useState } from "react";

export type CurrencySelectValue = {
  value: string;
  symbol: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  }
  address: string
};

interface CountrySelectProps {
   value: CurrencySelectValue | undefined
   onChange: (selectedOption: CurrencySelectValue | null) => void
}

export default function CurrencySelect({
    value,
    onChange,
  }: CountrySelectProps) {
  const { getAllCurrency, isLoading, error } = useCurrency();
  // const [selectedCurrency, setSelectedCurrency] = useState<CurrencySelectValue | null>(null);
//  const {selectedCurrency, setSelectedCurrency} = useSelectedCurrency()



  

  return (
    <div className="">
      <Select
        required
        placeholder="Currency"
        isClearable
        isLoading={isLoading}
        options={getAllCurrency()}
        value={value}
        onChange={onChange}
        formatOptionLabel={(option) => (
          <div className="flex flex-row items-center gap-3">
            <Image src={option.image.thumb} alt={option.symbol} width={24} height={24} />
            <div>
              {option.symbol.toUpperCase()}
            </div>
          </div>
        )}
        classNames={{
          control: () => "p-2 border-2 border-gray-300",
          input: () => "text-sm placeholder:text-sm",
          option: () => "text-sm",
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary25: "#ffe4e4",
            primary: "black",
          }
        })}
      />
      
    </div>
  );
}

