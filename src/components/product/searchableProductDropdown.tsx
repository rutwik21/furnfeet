
"use client";
import { useState } from "react";
import dynamic from 'next/dynamic';

const Select = dynamic(() => import('react-select'), { ssr: false });

interface Options{
  label: string,
  value: string
}

const SearchableDropdown = ({ options, placeholder, defaultValue, getSelectedOption}:
  {options?: Options[],placeholder:string, defaultValue?: Options, getSelectedOption: Function}) => {

  const [selectedOption, setSelectedOption] = useState<Options | null>(defaultValue?defaultValue:null);

  const handleChange = (option: any) => {
    setSelectedOption(option);
    getSelectedOption(option.value);
  };

  return (
    <div className="w-56 md:w-72">
      {
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
      }
    </div>
  );
};

export default SearchableDropdown;
