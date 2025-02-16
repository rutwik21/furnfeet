// 'use client'
// import * as React from 'react';
// import { SelectInput, useField } from 'payload/components/forms';
// import { getPayloadClient } from '../../get-payload';
// import { ProductPriceList } from '@/payload-types';

// export const CustomSelectComponent: React.FC<{ path: string }> = ({ path }) => {
//   const { value, setValue } = useField<string>({ path });
//   const [options, setOptions] = React.useState<{label:string, value:string}[]>([]);

//   // Fetch options on component mount
//   React.useEffect(() => {
//     const fetchOptions = async () => {
//       try {

//         const payload = await getPayloadClient();
//         const {docs }= await payload.find({
//           collection:'productPriceList'
//         });
//         const priceList = docs as unknown as ProductPriceList[];

//         const options = priceList.map(({productName, id}) =>{
//           return {label: productName,value:id}
//         })
//         setOptions(options);


//         // const response = await fetch('https://restcountries.com/v3.1/all');
//         // const data = await response.json();

//         // const countryOptions = data.map((country: { name: { common: string; }; flag: string; }) => {
//         //   return {
//         //     label: `${country.name.common + ' ' + country.flag}`,
//         //     value: country.name.common,
//         //   };
//         // });

//         // setOptions(countryOptions.sort(
//         //   (a: { label: string; }, b: { label: any; }) => a.label.localeCompare(b.label)
//         // ));
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchOptions();
//   }, []);



//   return (
//     <div>
//       <label className='field-label'>
//         Price
//       </label>
//       <SelectInput
//         path={path}
//         name={path}
//         options={options}
//         value={value}
//         onChange={(e) => setValue(e.value)}
//       />
//     </div>
//   )
// };