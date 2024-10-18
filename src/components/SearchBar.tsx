'use client'
import { PRODUCT_CATEGORIES, PRODUCT_SUB_CATEGORIES } from '@/config'
import { Input } from './ui/input'
import {useState, useRef, LegacyRef, RefObject, MutableRefObject, HTMLInputTypeAttribute} from 'react';
import { cn } from '@/lib/utils';

interface Product { label:string, value: string};

const SearchBar = ({className}:{className?: string}) => {

  const [searchOutput, setSearchOutput] = useState<Array<Product>>([])

  const inputText = useRef<any>('');

  const handleSearchInput=(text:string)=>{
    if(text.length > 3){
      text = text.toLowerCase();
      const a = PRODUCT_SUB_CATEGORIES.filter(obj=>(
        (obj.label.toLowerCase()).includes(text)
      ));
      if(a.length === 0){

      }
      setSearchOutput(a);
    }
    else if(text.length === 0 && searchOutput.length > 0){
      setSearchOutput([]);
    }
  }

  const handleSearchSelected = (value: string)=>{
    inputText.current.value = value;
    setSearchOutput([]);
  }
  return (
    <div className='z-30 md:z-50 relative'>
        <Input ref={inputText} placeholder='Search' onChange={($event)=>(handleSearchInput($event.target.value))} className={className?className:''} />
        <div className={cn(' hidden border max-h-[50svh] w-full scrollable-content overflow-x-hidden bg-white absolute top-14 py-2',{'block': searchOutput.length>0})}>
            {searchOutput.map((products,i)=>{
              return <div onClick={()=>handleSearchSelected(products.label)} key={products.value} className={cn('hover:bg-gray-200 border-b px-5 py-1 cursor-pointer font-semibold',{
                'border-b-0': i === searchOutput.length-1
              })}>
                {products.label}
                </div>
            })}
        </div> 
    </div>
  )
}

export default SearchBar