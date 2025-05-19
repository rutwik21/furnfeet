
"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";
// import dynamic from 'next/dynamic';
import Select from 'react-select'
import React from 'react'
// const Select = dynamic(() => import('react-select'), { ssr: false });

interface Options{
  label: string,
  value: string
}

const SearchableDropdown = ({ options, placeholder, defaultValue, getSelectedOption, className}:
  {options?: Options[],placeholder:string, defaultValue?: Options, getSelectedOption: Function, className?:string}) => {

  const [selectedOption, setSelectedOption] = useState<Options | null>(defaultValue?defaultValue:null);

  const handleChange = (option: any) => {
    setSelectedOption(option);
    getSelectedOption(option.value);
  };

  return (
    <div className={cn("w-56 md:w-72", className)}>
      <Select
        className="border rounded shadow-none"
        options={options}
        value={selectedOption}
        onChange={handleChange}
        placeholder={placeholder}
        isSearchable={true}
        // getOptionLabel={(e) => e.label}
        // getOptionValue={(e) => e.value}
      />
    </div>
  );
};

export default SearchableDropdown;
