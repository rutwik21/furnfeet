import { PRODUCT_CATEGORIES } from '../../config';
import { CollectionConfig } from 'payload/types'

function getMeUnits(){
  return [
    {label: 'per Sq. Feet', value: 'perSqFt'},
    {label: 'per Running Feet', value: 'perRunningFt'},
    {label: 'per Feet', value: 'perFt'},
    {label: 'per Meter', value: 'perMtr'},
    {label: 'per Sq. Meter', value: 'perSqMtr'}
  ]
}
function getMeRawMaterials(){

    let output:{label:string,value:string}[] = [
      {label: 'Height', value:'height'}, 
      {label: 'Width', value:'width'},
      {label: 'Length', value:'length'},
    ];

    PRODUCT_CATEGORIES.forEach(({featured, value}) => {
      if(value === 'raw_materials'){
        featured.forEach(({name,value})=>{
          const temp1 = [{label:name,value:value}];
          output = [...output, ...temp1];
        })
      }
    })
    return output;
  }
  function getMeFabricTypes(){

    let output:{label:string,value:string}[] = [];

    PRODUCT_CATEGORIES.forEach(({featured, value}) => {
      if(value === 'raw_materials'){
        featured.forEach(({value,subCategories})=>{
          if(value==='fabric'){
            const temp1 = subCategories.map(({name,value})=>({label:name,value:value}));
            output = [...output, ...temp1];
          }
        })
      }
    })
    return output;
  }

  function getMeFabrics(){

    let output:{label:string,value:string}[] = [];

    
    PRODUCT_CATEGORIES.forEach(({featured, value}) => {
      if(value === 'raw_materials'){
        featured.forEach(({value,subCategories})=>{
          if(value==='fabric'){
            const temp1 = subCategories.map(({name,value})=>({label:name,value:value}));
            output = [...output, ...temp1];
          }
        })
      }
    })
    return output;
  }

export const ProductPriceList: CollectionConfig = {
  slug: 'productPriceList',
  access: {
    delete: async ({ req }) => req.user.role == 'admin',
    update: async ({ req }) => req.user.role == 'admin',
  },
  admin: {
    hidden: ({ user }) => user.role !== 'admin',
  },
  hooks: {
    beforeChange:[
      async ({ data }) => {
        const { mrp, discount, sizes, customizedSizeMrp } = data;
      
        if (sizes) {
          for (const size of sizes) {
            const { mrp } = size;
            if (mrp) {
              if(discount && discount <= 100){
                // Calculate the final price
                size.finalPrice = Math.round(mrp - (mrp * discount) / 100);
              }else{
                size.finalPrice = mrp
              }
            }
          }
        }
        
        if (mrp) {
          if(discount && discount <= 100){
            // Calculate the final price
            data.finalPrice = Math.round(mrp - (mrp * discount) / 100);
          }else{
            data.finalPrice = mrp
          }
        }

        if (customizedSizeMrp) {
          if(discount && discount <= 100){
            // Calculate the final price
            data.customizedSizeFinalPrice = Math.round(customizedSizeMrp - (customizedSizeMrp * discount) / 100);
          }else{
            data.customizedSizeFinalPrice = customizedSizeMrp
          }
        }
        return data; // Return the modified data
      },
    ]
  },
  fields:[
    {
      type:'row',
      fields:[
        {
          name:'isCustomizable',
          label:'Customizable',
          type:'checkbox',
          defaultValue: false
        },
        {
          name:'hasStandardSizes',
          label:'Has Standard Sizes?',
          type:'checkbox',
          defaultValue: false
        },
      ]
    },
    {
      name: 'id',
      type: 'text',
      label: 'Product Name (ID)',
      admin:{
        description:"You Cannot Change It Later. Don't use (/)"
      },
      required: true,
    },
    {
      type:'row',
      fields:[
        
        {
          name: 'mrp',
          type: 'number',
          label: 'MRP',
          required: true,
        },
        {
          name: 'unit',
          type: 'select',
          label: 'Per Unit',
          options: getMeUnits(),
          required: true,
        },
        {
          name: 'discount',
          type: 'number',
          label: 'Discount (%)',
        },
        {
          name: 'finalPrice',
          type: 'number',
          label: 'Final Price',
          access:{
            read:()=>true,
            update:()=>false,
            create:()=>false,
          },
        },
      ]
    },
    {
      type:'row',
      fields:[
        {
          name: 'whatIsCustomizable',
          label: 'What Is Customizable?',
          type: 'select',
          hasMany: true,
          options: getMeRawMaterials(),
          required: true,
          admin:{
            condition: (_,{isCustomizable})=> Boolean(isCustomizable) || false
          }
        },
        {
          name: 'fabricType',
          label: 'Fabric Type',
          type: 'select',
          options: getMeFabricTypes(),
          required: true,
          admin:{
            condition: (data)=> data?.whatIsCustomizable?.includes("fabric") && Boolean(data?.isCustomizable) || false
          }
        },
        {
          name: 'fabric',
          label: 'Fabric',
          type: 'relationship',
          relationTo: 'products',
          required: true,
          admin:{
            condition: (data)=> data?.whatIsCustomizable?.includes("fabric") && Boolean(data?.isCustomizable) || false
          }
        },
        {
          name: 'maxFabricPrice',
          label: 'Max Fabric Price',
          type: 'number',
          required: true,
          admin:{
            condition: (data)=> data?.whatIsCustomizable?.includes("fabric") && Boolean(data?.isCustomizable) || false
          }
        }
      ]
    },
    {
      type:'row',
      fields:[
        {
          name: 'minLength',
          label: 'Minimum Length',
          type: 'number',
          required: true,
          admin:{
            condition: (data)=> data?.whatIsCustomizable?.includes("length") && Boolean(data?.isCustomizable) || false
          }
        },
        {
          name: 'minWidth',
          label: 'Minimum Width',
          type: 'number',
          required: true,
          admin:{
            condition: (data)=> data?.whatIsCustomizable?.includes("width") && Boolean(data?.isCustomizable) || false
          }
        },
        {
          name: 'minHeight',
          label: 'Minimum Height',
          type: 'number',
          required: true,
          admin:{
            condition: (data)=> data?.whatIsCustomizable?.includes("height") && Boolean(data?.isCustomizable) || false
          }
        },
      ],
      admin:{
        condition: (data)=> data?.whatIsCustomizable?.length>0  && Boolean(data?.isCustomizable) || false
      }
    },
    {
      type:'row',
      fields:[
        {
          name: 'maxLength',
          label: 'Maximum Length',
          type: 'number',
          required: true,
          admin:{
            condition: (data)=> data?.whatIsCustomizable?.includes("length") && Boolean(data?.isCustomizable) || false
          }
        },
        {
          name: 'maxWidth',
          label: 'Maximum Width',
          type: 'number',
          required: true,
          admin:{
            condition: (data)=> data?.whatIsCustomizable?.includes("width") && Boolean(data?.isCustomizable) || false
          }
        },
        {
          name: 'maxHeight',
          label: 'Maximum Height',
          type: 'number',
          required: true,
          admin:{
            condition: (data)=> data?.whatIsCustomizable?.includes("height") && Boolean(data?.isCustomizable) || false
          }
        },
      ],
      admin:{
        condition: (data)=> data?.whatIsCustomizable?.length>0 && Boolean(data?.isCustomizable) || false
      }
    },
    {
      type:'row',
      fields:[
        {
          name: 'customizedSizeMrp',
          type: 'text',
          label: 'Customized Size MRP',
          required: true,
          admin:{
            condition: (_,{isCustomizable})=> Boolean(isCustomizable) || false
          }
        },
        {
          name: 'customizedSizeUnit',
          type: 'select',
          label: 'Customized Size Unit',
          options: getMeUnits(),
          required: true,
          admin:{
            condition: (_,{isCustomizable})=> Boolean(isCustomizable) || false
          }
        },
        {
          name: 'customizedSizeFinalPrice',
          type: 'number',
          label: 'Customized Size Final Price',
          access:{
            read:()=>true,
            update:()=>false,
            create:()=>false,
          },
          admin:{
            condition: (_,{isCustomizable})=> Boolean(isCustomizable) || false
          }
        },
      ]
    },

    {
      name: 'sizes',
      type: 'array',
      label: 'Sizes (inch) ',
      required: true,
      fields:[
        {
          type:'row',
          fields:[
            {
                name: 'length',
                type: 'number',
                label: 'Length',
                required: true,
            },
            {
                name: 'width',
                type: 'number',
                label: 'Width',
                required: true,
            },
            {
                name: 'height',
                type: 'number',
                label: 'Height',
            },
            {
                name: 'mrp',
                type: 'number',
                label: 'MRP',
                required: true,
            },
            {
                name: 'finalPrice',
                type: 'number',
                label: 'Final Price',
                access:{
                  read:()=>true,
                  update:()=>false,
                  create:()=>false,
                },
            },
            
          ],
        },
      ],
      admin:{
        condition: (_,{hasStandardSizes})=> Boolean(hasStandardSizes) || false
      }
    },
  ],
}
