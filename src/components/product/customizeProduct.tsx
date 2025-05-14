"use client"
import { Label } from '@/components/ui/label'
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input';
import { Product } from '@/payload-types';
import { trpc } from '@/trpc/client';
import SearchableDropdown from './searchableProductDropdown';
import { z } from "zod"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import AddToCartButton from '../AddToCartButton';
import { CartItem } from '@/lib/custom_interfaces';


function CustomizeProduct({product, setFinalPrice, setMrp, setCartItemState, cartItem}:
    {product:Product, setFinalPrice:Function, setMrp: Function, setCartItemState: Function, cartItem: CartItem}) {

    const price = typeof product.price != "string"?product.price:null
    const CustomizedProductValidator = z.object({
        dimensions: z.array(
            z.object({
              length: z.string()
                .transform((val) => Number(val))
                .refine((val) => !isNaN(val), {message: "Length must be a valid number in inches"})
                .pipe(z.number()
                .min(price?.minLength!, `We don't accept orders less than ${price?.minLength}" in length`)
                .max(price?.maxLength!, `We don't accept orders more than ${price?.maxLength}" in length`)),
              width: z.string()
                .transform((val) => Number(val))
                .refine((val) => !isNaN(val), {message: "Width must be a valid number in inches"})
                .pipe(z.number()
                .min(price?.minWidth!, `We don't accept orders less than ${price?.minWidth}" in width`)
                .max(price?.maxWidth!, `We don't accept orders more than ${price?.maxWidth}" in width`)),
              height: z.string()
                .transform((val) => Number(val))
                .refine((val) => !isNaN(val), {message: "Height must be a valid number in inches"})
                .pipe(z.number()
                .min(price?.minHeight!, `We don't accept orders less than ${price?.minHeight}" in Height`)
                .max(price?.maxHeight!, `We don't accept orders more than ${price?.maxHeight}" in Height`)).optional(),
              unit: z.string().default('inch')
            })
          ).min(1, "At least one dimension is required").optional(),
        fabric: z.string().optional(),
        foam: z.string().optional(),
    });
    type TCustomizedProductValidator = z.infer<
      typeof CustomizedProductValidator
    >
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<TCustomizedProductValidator>({
        resolver: zodResolver(CustomizedProductValidator),
      })
      const onSubmit = ({
        dimensions,
        fabric,
        foam
      }: TCustomizedProductValidator) => {
            cartItem.isCustomized = true
            
            if(dimensions && dimensions?.length>0){
                //@ts-ignore
                cartItem.dimensions = dimensions
            }
            if(selectedFabric){
                fabricOptions.forEach(({id,name})=>{
                    if(id==selectedFabric){
                        cartItem.fabricName = name
                    }
                })
                cartItem.fabric = selectedFabric
            }
            if(selectedFoam){
                cartItem.foam = selectedFoam
            }
            let isStandardSize = false;
            if(price?.hasStandardSizes){
                let mrp = 0;
                let finalPrice = 0;
                cartItem.dimensions.map(i=>{
                    price.sizes?.map((p)=>{ 
                        if(p.length == i.length && p.width == i.width && p.height == i.height){
                            mrp = mrp + p.mrp;
                            finalPrice = finalPrice + (p.finalPrice?p.finalPrice:0);
                            isStandardSize = true;
                        }
                    })
                    if(!isStandardSize && price.roundupStandardSize){
                        let StandardLength = 0;
                        let StandardWidth = 0;
                        let StandardHeight = 0;
                        price.sizes?.map((p)=>{
                            if(!StandardLength && p.length >= i.length){
                                StandardLength = p.length;
                            }
                            if(!StandardWidth && p.width >= i.width){
                                StandardWidth = p.width;
                            }
                            if(!StandardHeight && p.height == i.height){
                                StandardHeight = p.height || 0;
                            }
                        });
                        price.sizes?.map((p)=>{ 
                            if(p.length == StandardLength && p.width == StandardWidth && p.height == StandardHeight){
                                mrp = mrp + p.mrp;
                                finalPrice = finalPrice + (p.finalPrice?p.finalPrice:0);
                                isStandardSize = true;
                            }
                        });
                        StandardLength = 0;
                        StandardWidth = 0;
                        StandardHeight = 0;
                    }
                });
                // cartItem.fabric = fabric;
                // cartItem.foam = foam;
                cartItem.price = finalPrice;
                cartItem.qty = Number(qty);
                cartItem.totalPrice = Number(qty) * finalPrice;
                setMrp(formatPrice(mrp) );
                setFinalPrice(formatPrice(finalPrice));
            };
            
            if(!isStandardSize){
                let mrp = 0;
                let finalPrice = 0;
                
                if(price?.customizedSizeUnit==='perFt' || price?.customizedSizeUnit==='perMtr'){
                    let totalLengthInInches = 0;
                    cartItem.dimensions.map(i=>{
                        totalLengthInInches = totalLengthInInches + i.length;
                    });
                    mrp = Math.round(totalLengthInInches/12) * Number(price.customizedSizeMrp);
                    finalPrice = Math.round(totalLengthInInches/12) * Number(price.customizedSizeFinalPrice);
                }
                else if(price?.customizedSizeUnit==='perRunningFt'){
                    let totalLengthInInches = 0;
                    cartItem.dimensions.map(i=>{ 
                        totalLengthInInches = totalLengthInInches + i.length + i.width;
                    });
                    mrp = Math.round(totalLengthInInches/12) * Number(price.customizedSizeMrp);
                    finalPrice = Math.round(totalLengthInInches/12) * Number(price.customizedSizeFinalPrice);
                }
                else if(price?.customizedSizeUnit==='perSqFt'){
                    let totalLengthInInches = 0;
                    let totalWidthInInches = 0;
                    cartItem.dimensions.map(i=>{ 
                        totalLengthInInches = totalLengthInInches + i.length;
                        totalWidthInInches = totalWidthInInches + i.width;
                    });
                    const totalSqFt = Math.round(totalLengthInInches/12) * Math.round(totalWidthInInches/12);
                    mrp = totalSqFt * Number(price.customizedSizeMrp);
                    finalPrice = totalSqFt * Number(price.customizedSizeFinalPrice);
                }
                else if(price?.customizedSizeUnit==='perSqMtr'){
                    let totalLengthInInches = 0;
                    let totalWidthInInches = 0;
                    cartItem.dimensions.map(i=>{ 
                        totalLengthInInches = totalLengthInInches + i.length;
                        totalWidthInInches = totalWidthInInches + i.width;
                    });
                    const totalSqMtr = (totalLengthInInches * totalWidthInInches)/1550; //to convert into sq mtr
                    mrp = totalSqMtr * Number(price.customizedSizeMrp);
                    finalPrice = totalSqMtr * Number(price.customizedSizeFinalPrice);
                }
                // cartItem.fabric = fabric;
                // cartItem.foam = foam;
                cartItem.price = finalPrice;
                cartItem.qty = Number(qty);
                cartItem.totalPrice = Number(qty) * finalPrice;
                setMrp(formatPrice(mrp) );
                setFinalPrice(formatPrice(finalPrice));
            }
            setCustomizedProdSaved(true);
        }
        const [isCustomizedProduct, setIsCustomizedProduct] = useState<boolean>(false);
        const [fabricOptions, setFabricOptions] = useState<Product[]>([]);
        const [customizedProdSaved, setCustomizedProdSaved] = useState<boolean>(false);
        
        const [selectedFabric, setSelectedFabric] = useState<string | null>(typeof price?.fabric == 'string'?null:price?.fabric?.id!);
        const [selectedFoam, setSelectedFoam] = useState<string | null>("50Density");
    const [qty, setQty] = useState<string | null>('1');


    const handleChange = (value:boolean) => {
        if(value === false){
            const price = typeof product.price != 'string'?product.price:null;

            cartItem.qty = 0;
            cartItem.price = price?.finalPrice!;
            cartItem.totalPrice = price?.finalPrice!;
            setMrp(formatPrice(price?.mrp!));
            setFinalPrice(formatPrice(price?.finalPrice!));
        }
        setIsCustomizedProduct(value);
        cartItem.isCustomized = value
    };

    const { mutate: getMeFabricOptions } =
    trpc.product.fabricOptions.useMutation({
      onSuccess: async (products) => {
        setFabricOptions(products)
      },
      onError: (err) => {
        if (err.data?.code === 'NOT_FOUND') {
          console.error(err.data)
        }
      },
    });
    
    const foamOptions = [
        {label:'50 Density', value:'50Density'},
        {label:'40 Density', value:'40Density'},
        {label:'32 Density', value:'32Density'},
    ]
    const qtyOptions = [
        {label:'1', value:'1'},
        {label:'2', value:'2'},
        {label:'3', value:'3'},
        {label:'4', value:'4'},
        {label:'5', value:'5'},
        {label:'6', value:'6'},
    ]
    
    useEffect(()=>{
        if(typeof product.price != "string" && product.price.whatIsCustomizable?.includes('fabric')){
            getMeFabricOptions({maxRate:product.price.maxFabricPrice!, clothCategory: product.price.fabricType!});
        }
    },[])

    return (
        <div className='mt-2 md:mt-4 w-full'>
            <div className="flex space-x-2">
                <Checkbox onCheckedChange={handleChange} />
                <Label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                Customize this product?
                </Label>
            </div>
            {
                <div
                    //  className='mt-2 md:mt-4 border space-y-3 rounded-md p-4 md:px-6 w-full'
                    className={` border space-y-3 rounded-md w-full shadow-lg transition-all duration-300 ${
                        isCustomizedProduct
                        ? "mt-2 md:mt-4 p-4 md:px-6 opacity-100 translate-y-0"
                        : "h-0 opacity-0 translate-y-[-10] pointer-events-none"
                    }`}
                    >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {
                            product.dimensions?.map((size,i) => {
                                if(product.dimensions && product.dimensions?.length > 1){
                                    return <div key={i}> 
                                            <div className='text-sm p-0 flex gap-2 space-y-1 items-center'>Size{i+1}: 
                                            
                                                <div className="flex gap-1 items-center m-0 p-0">
                                                    <Input className='max-w-12 p-1 m-0 md:p-2 md:max-w-16 ' 
                                                        // min={ typeof product.price!='string'? product.price.minLength!:1 } 
                                                        // max={ typeof product.price!='string'? product.price.maxLength!:1000 } 
                                                        type='text' defaultValue={size.length} 
                                                        {...register(`dimensions.${i}.length`)}
                                                        disabled={!price?.whatIsCustomizable?.includes('length')}/>
                                                    <span >L x </span>
                                                </div>
                                            
                                                <div className="flex gap-1 items-center m-0 p-0">
                                                    <Input className='max-w-12 p-1 m-0 md:p-2 md:max-w-16 ' 
                                                        // min={ typeof product.price!='string'? product.price.minWidth!:1 } 
                                                        // max={ typeof product.price!='string'? product.price.maxWidth!:1000 } 
                                                        type='text' defaultValue={size.width}
                                                        {...register(`dimensions.${i}.width`)}
                                                        disabled={!price?.whatIsCustomizable?.includes('width')} />
                                                    <span >W </span> 
                                                </div>
                                            {
                                                size.height?
                                                <div className="flex gap-1 items-center m-0 p-0">
                                                    <span >x </span> 
                                                    <Input className='ms-1 max-w-12 p-1 m-0 md:p-2 md:max-w-16 ' 
                                                        // min={ typeof product.price!='string'? product.price.minHeight!:1 } 
                                                        // max={ typeof product.price!='string'? product.price.maxHeight!:1000 } 
                                                        type='text' defaultValue={size.height} 
                                                        {...register(`dimensions.${i}.height`)}
                                                        disabled={!price?.whatIsCustomizable?.includes('height')}/>
                                                    <span >H</span>
                                                </div>:null
                                            }
                                            
                                        </div>
                                    
                                        {errors?.dimensions?.length! > 0  && (
                                            <div className='text-sm text-red-500'>
                                            { 
                                                //@ts-ignore 
                                                errors.dimensions?.map(({length, width, height},index)=>{
                                                    if((length?.message || width?.message || height?.message) && index==i){
                                                        return <div key={i}>
                                                            <p>{length?.message}</p>
                                                            <p>{width?.message}</p>
                                                            <p>{height?.message}</p>
                                                        </div>
                                                    }
                                                    return null
                                                })
                                            }
                                            </div>
                                        )}
                                    </div>
                                }
                                return <div key={i}>
                                    <div className='text-sm p-0 flex gap-2 space-y-1 items-center'>Size: 
                                            
                                            <div className="flex gap-1 items-center m-0 p-0">
                                                <Input className='max-w-12 p-1 m-0 md:p-2 md:max-w-16 ' 
                                                    // min={ typeof product.price!='string'? product.price.minLength!:1 } 
                                                    // max={ typeof product.price!='string'? product.price.maxLength!:1000 } 
                                                    type='text' defaultValue={size.length} 
                                                    {...register(`dimensions.${0}.length`)}
                                                    disabled={!price?.whatIsCustomizable?.includes('length')}/>
                                                <span >L x </span>
                                            </div>
                                            
                                            <div className="flex gap-1 items-center m-0 p-0">
                                                <Input className='max-w-12 p-1 m-0 md:p-2 md:max-w-16 ' 
                                                    // min={ typeof product.price!='string'? product.price.minWidth!:1 } 
                                                    // max={ typeof product.price!='string'? product.price.maxWidth!:1000 } 
                                                    type='text' defaultValue={size.width}
                                                    {...register(`dimensions.${0}.width`)}
                                                    disabled={!price?.whatIsCustomizable?.includes('width')} />
                                                <span >W </span> 
                                            </div>
                                        {size.height?
                                            <div className="flex gap-1 items-center m-0 p-0">
                                                <span >x </span> 
                                                <Input className='ms-1 max-w-12 p-1 m-0 md:p-2 md:max-w-16 ' 
                                                    // min={ typeof product.price!='string'? product.price.minHeight!:1 } 
                                                    // max={ typeof product.price!='string'? product.price.maxHeight!:1000 } 
                                                    type='text' defaultValue={size.height} 
                                                    {...register(`dimensions.${0}.height`)}
                                                    disabled={!price?.whatIsCustomizable?.includes('height')}/>
                                                <span >H</span>
                                            </div>
                                        :null}
                                        
                                    </div>
                                    {errors?.dimensions?.length! > 0  && (
                                        <div className='text-sm text-red-500'>
                                        { 
                                            //@ts-ignore 
                                            errors.dimensions?.map(({length, width, height},i)=>{
                                                if(length?.message || width?.message || height?.message){
                                                    return <div key={i}>
                                                        <p>{length?.message}</p>
                                                        <p>{width?.message}</p>
                                                        <p>{height?.message}</p>
                                                    </div>
                                                }
                                                return null
                                            })
                                        }
                                        </div>
                                    )}

                                </div>
                                
                            })
                        }
                        {
                            typeof product.price != 'string'? product.price.whatIsCustomizable?.includes('fabric')?
                                <div className='text-sm mt-2 flex items-center md:mt-4'>
                                    <span className='flex-1'>Fabric:</span>
                                    <div className='ms-2'>
                                        <SearchableDropdown options={fabricOptions.map(({id,name})=>({label:name, value:id}))} 
                                            defaultValue={{
                                                label:typeof price?.fabric == 'string'?"":price?.fabric?.name!,
                                                value:typeof price?.fabric == 'string'?"":price?.fabric?.id!
                                            }} 
                                            placeholder='Select Fabric' 
                                            getSelectedOption={setSelectedFabric}/>
                                        {selectedFabric? 
                                            <Link href={`/product/${selectedFabric}`} target='_'
                                            className='text-blue-500 hover:text-blue-700 hover:underline rounded-md self-center text-sm font-normal items-center mt-2'><ExternalLink className='w-4 me-1 inline-block' />See this fabric</Link>
                                        :null}
                                    </div>
                                </div>
                            :null:null
                        }
                        {
                            typeof product.price != 'string'? product.price.whatIsCustomizable?.includes('foam')?
                                <div className='text-sm mt-2 flex items-center md:mt-4'>
                                    <span className='flex-1'>Foam:</span>
                                    <div className='ms-2'>
                                        <SearchableDropdown options={foamOptions} 
                                        defaultValue={{
                                            label:"50 Density",
                                            value:"50Density"
                                        }} 
                                        placeholder='Select Foam Density' 
                                        getSelectedOption={setSelectedFoam}/>
                                    </div>
                                </div>
                            :null:null
                        }
                        <div className='text-sm mt-2 flex items-center md:mt-4'>
                            <span className='flex-1'>Qty:</span>
                            <div className='ms-2'>
                                <SearchableDropdown options={qtyOptions} 
                                defaultValue={{
                                    label:"1",
                                    value:"1"
                                }} 
                                placeholder='Select Qty' 
                                getSelectedOption={setQty}/>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full mt-4">
                            <Button type='submit' size='lg' variant={'outline'} className='w-full' >Save</Button>
                            {customizedProdSaved? <AddToCartButton product={product} cartItem={cartItem} />:null}
                        </div>
                        {product.quantity>0 && Number(cartItem.qty) > Number(product.quantity)?
                            <p className='text-red-700 text-center text-sm mt-2'>Available quantity is {product.quantity}</p>
                        :null}
                    </form>
                </div>
                
            }

        </div>
    )
}

export default CustomizeProduct
