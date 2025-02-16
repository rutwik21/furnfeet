'use client'
import { PRODUCT_CATEGORIES } from '@/config'
import { Input } from './ui/input'
import {useState, useRef, LegacyRef, RefObject, MutableRefObject, HTMLInputTypeAttribute} from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface Product { label:string, value: string, href:string};

const SearchBar = ({className}:{className?: string}) => {

  const router = useRouter()
  const [searchOutput, setSearchOutput] = useState<Array<Product>>([])

  const inputText = useRef<any>('');

  function getMeSubCategories(){
    let output:{label:string,value:string, href:string}[] = [];
    PRODUCT_CATEGORIES.forEach(({featured}) => {
      featured.forEach(({subCategories,name,value, href})=>{
        const temp1 = [{label:name,value:value, href: href}];
        const temp = subCategories.map(({name,value,href})=>({label:name,value:value, href:href}));
        output = [...output, ...temp1, ...temp ];
      })
    })
    return output;
  }
  
  const handleSearchInput=(text:string)=>{
    if(text.length > 3){
      text = text.toLowerCase();
      const a = getMeSubCategories().filter(obj=>(
        (obj.label.toLowerCase()).includes(text)
      ));
      setSearchOutput(a);
    }
    else if(text.length === 0 && searchOutput.length > 0){
      setSearchOutput([]);
    }
  }

  const handleSearchSelected = (value: Product)=>{
    inputText.current.value = value.label;
    router.replace(value.href);
    setSearchOutput([]);
  }
  return (
    <div className='z-30 md:z-50 relative'>
        <Input ref={inputText} placeholder='Search' onChange={($event)=>(handleSearchInput($event.target.value))} className={className?className:''} />
        <div className={cn(' hidden border max-h-[50svh] w-full scrollable-content overflow-x-hidden bg-white absolute top-14 py-2',{'block': searchOutput.length>0})}>
            {searchOutput.map((products,i)=>{
              return <div onClick={()=>handleSearchSelected(products)} key={products.value} 
              className={cn('hover:bg-gray-200 border-b px-5 py-1 cursor-pointer font-semibold',{
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