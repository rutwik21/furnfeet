import { z } from 'zod'
import {
  privateProcedure,
  router,
} from './trpc'
import { TRPCError } from '@trpc/server'
import { getPayloadClient } from '../get-payload'
import { razorpayInstance, RezorpaySuccessResponseValidator } from '../lib/razorpay'
import { Address, CommissionLedger, Order, Product, User } from '@/payload-types'
import { ADDED_CHARGES, PRODUCT_CATEGORIES } from '../config'
import { OrderItem, ProductsWithNewQty } from '@/lib/custom_interfaces'
import { Payload } from 'payload'

function getMeSubCategories(subCat: string){
  // let output:{readonly label:string, readonly value: number}[];
  let output:{label:string, value:number}[] = []
  PRODUCT_CATEGORIES.forEach(({featured}) => {
    featured.forEach(({subCategories,value, commission})=>{
      if(value == subCat) {
        output = commission.map((e)=>e);
        return output
      }
      else{
        subCategories.forEach(({value, commission})=>{
          if(value==subCat) {
            output = commission.map((e)=>e);
            return output
          }
        })
      }
    })
  })
  return output;
}

export const paymentRouter = router({
  createSession: privateProcedure
    .input( z.array(z.object({
      productId: z.string(),
      qty: z.number().int(),
      dimensions: z.array(z.object({
          length: z.number(),
          width: z.number(),
          height: z.number().nullable().optional(),
          unit: z.literal("inch"),
          id: z.string().nullable().optional(),
      })),
      fabric:z.string().optional(),
      foam:z.string().optional(),
      profit:z.number().optional(),
      commission:z.number().optional(),
      price: z.number(),
      totalPrice: z.number(),
    })))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx
      
      if (input.length === 0) {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }

      const payload = await getPayloadClient()

      const priceArray = input.map(({totalPrice}) => (totalPrice));
      let totalCartPrice:number = 0;
      ADDED_CHARGES.forEach(ele=>{
        totalCartPrice = totalCartPrice + ele.value;
      })
      priceArray.forEach((price) =>{
        totalCartPrice = totalCartPrice + Number(price)
      });

      const getDate=(which="today")=>{
        const currentDate = new Date();
        const date = new Date(currentDate);
        if(which=="deliveryDate"){
          date.setDate(currentDate.getDate() + 6);
          return date;
        }else{
          date.setDate(currentDate.getDate());
          return date;
        }
      }

      const errors:string[] = [];
      let data:OrderItem[] | null = null;
      const commisionGoesTo = user.role != 'user'? user.id: (user.referedBy as User).id;
      const isEligibleToRecieveCommission = user.role != 'user'? user.isEligibleForReferalProgram: (user.referedBy as User).isEligibleForReferalProgram;

      const commisionPerProduct:{productName: string, category: string, commissionInPercent:number, commision: number}[] = []
      try {
        data = await Promise.all(input.map( async (productDetails)=>{
          const { docs } = await payload.find({
            collection: 'products',
            where:{
              id:{
                equals: productDetails.productId
              }
            },
            limit: 1
          });
          const product = docs as unknown as Product[];
          if(!product || product.length==0){
            errors.push(`Product is not available`);
          }
          if(product[0].quantity==0){
            errors.push(`${product[0].name} is out of stock`);
          }
          
          if(product[0].quantity > 0 && product[0].quantity < productDetails.qty){
            errors.push(`Available quantity is ${product[0].quantity} for ${product[0].name}`);
          }
          const profit = (productDetails.totalPrice - (productDetails.totalPrice * product[0].margin) / 100)
          let commissionGiven = 0;
          let commissionPercent = 0;
          if(isEligibleToRecieveCommission){
            if(product[0].overrideCommission){
              if(user.role == 'architect' || (user.referedBy as User).role == 'architect'){
                commissionGiven = (productDetails.totalPrice * product[0].architect) / 100;
                commissionPercent = product[0].architect;
              }
              else if(user.role == 'interiorDesigner' || (user.referedBy as User).role == 'interiorDesigner'){
                commissionGiven = (productDetails.totalPrice * product[0].interiorDesigner) / 100;
                commissionPercent = product[0].interiorDesigner;
              }
              else if(user.role == 'karagir' || (user.referedBy as User).role == 'karagir'){
                commissionGiven = (productDetails.totalPrice * product[0].karagir) / 100;
                commissionPercent = product[0].karagir;
              }
            }
            else{
              if(product[0].subcategory.length>0){
  
                const commission = getMeSubCategories(product[0].subcategory[0]);
  
                if(user.role == 'architect' || (user.referedBy as User).role == 'architect'){
                  const archCommission = commission.filter(ele=>ele.label==="Architect")[0]?.value;
                  commissionGiven = (productDetails.totalPrice * archCommission || 0) / 100;
                  commissionPercent = archCommission;
                }
                else if(user.role == 'interiorDesigner' || (user.referedBy as User).role == 'interiorDesigner'){
                  const interiorDesignerCommission = commission.filter(ele=>ele.label==="Interior Designer")[0]?.value;
                  commissionGiven = (productDetails.totalPrice * interiorDesignerCommission || 0) / 100;
                  commissionPercent = interiorDesignerCommission;
                }
                else if(user.role == 'karagir' || (user.referedBy as User).role == 'karagir'){
                  const karagirCommission = commission.filter(ele=>ele.label==="Karagir")[0]?.value;
                  commissionGiven = (productDetails.totalPrice * karagirCommission || 0) / 100;
                  commissionPercent = karagirCommission;
                }
              }
            }
          }
          
          productDetails.profit = profit;
          productDetails.commission = commissionGiven;

          if(isEligibleToRecieveCommission && commissionGiven>0){
            commisionPerProduct.push({
              productName: product[0].name,
              category: product[0].subcategory[0], 
              commissionInPercent: commissionPercent, 
              commision: commissionGiven
            });
          };

          return {
            productId: productDetails.productId,
            qty: productDetails.qty,
            dimensions: productDetails.dimensions,
            price: productDetails.totalPrice,
            fabric: productDetails.fabric || null,
            foam: productDetails.foam || null,
            profit: profit || null,
            commission: commissionGiven || null,
            isOrderCancelled: false,
            isMoneyRefunded: false,
            orderStatus: "received" as const,
            estimatedDeliveryDate: getDate("deliveryDate").toString(),
            updatedAt: getDate("today").toString(),
          };

        }))
      } 
      catch (error) {
        return { success : false, key_id : null, orderId: null, commisionPerProduct: null, 
          commisionGoesTo:null, isEligibleToRecieveCommission:false, errors: ["Something went wrong!"] };
      }

      if(errors.length>0){
        return { success : false, key_id : null, orderId: null, commisionPerProduct: null, 
          commisionGoesTo:null, isEligibleToRecieveCommission:false, errors: errors };
      }
      try {
        const options = {
          amount: totalCartPrice + '00',  // amount in the smallest currency unit
          currency: "INR"
        };
        let orderId1: string = '';
        razorpayInstance.orders.create(options, async (err, order) => {
          if(err){
            throw new TRPCError({ code: 'BAD_REQUEST' })
          }
          const {docs: defaultAddress} = await payload.find({
            collection: 'addresses',
            where:{
              user:{
                equals: user.id
              },
              isDefaultAddress: {
                equals: true
              }
            },
            limit: 1
          });
          await createOrder(payload, (defaultAddress as unknown as Address[] )[0], order.id, data, totalCartPrice, user.id, 'online');
          
          orderId1 = order.id;
        });
        while(!orderId1){
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        return { success: true, key_id : process.env.RAZORPAY_KEY_ID!, orderId : orderId1!, commisionPerProduct: commisionPerProduct, commisionGoesTo:commisionGoesTo, isEligibleToRecieveCommission:isEligibleToRecieveCommission, errors:[] }

      } catch (err) {
        return { success: false, key_id : null, orderId : null, commisionPerProduct: null, commisionGoesTo:null, isEligibleToRecieveCommission:false, errors: [] };
      }
    }),

  createOrder: privateProcedure
    .input( z.array(z.object({
      productId: z.string(),
      qty: z.number().int(),
      dimensions: z.array(z.object({
          length: z.number(),
          width: z.number(),
          height: z.number().nullable().optional(),
          unit: z.literal("inch"),
          id: z.string().nullable().optional(),
      })),
      fabric:z.string().optional(),
      foam:z.string().optional(),
      profit:z.number().optional(),
      commission:z.number().optional(),
      price: z.number(),
      totalPrice: z.number(),
    })))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx
      
      if (input.length === 0) {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }

      const payload = await getPayloadClient()

      const priceArray = input.map(({totalPrice}) => (totalPrice));
      let totalCartPrice:number = 0;
      ADDED_CHARGES.forEach(ele=>{
        totalCartPrice = totalCartPrice + ele.value;
      })
      priceArray.forEach((price) =>{
        totalCartPrice = totalCartPrice + Number(price)
      });

      const getDate=(which="today")=>{
        const currentDate = new Date();
        const date = new Date(currentDate);
        if(which=="deliveryDate"){
          date.setDate(currentDate.getDate() + 6);
          return date;
        }else{
          date.setDate(currentDate.getDate());
          return date;
        }
      }

      const productsWithNewQty:ProductsWithNewQty[] = [];
      const errors:string[] = [];
      let data:OrderItem[] | null = null;
      const commisionGoesTo = user.role != 'user'? user.id: (user.referedBy as User).id;
      const isEligibleToRecieveCommission = user.role != 'user'? user.isEligibleForReferalProgram: (user.referedBy as User).isEligibleForReferalProgram;

      const commisionPerProduct:{productName: string, category: string, commissionInPercent:number, commision: number}[] = []
      try {
        data = await Promise.all(input.map( async (productDetails)=>{
          const { docs } = await payload.find({
            collection: 'products',
            where:{
              id:{
                equals: productDetails.productId
              }
            },
            limit: 1
          });
          const product = docs as unknown as Product[];
          if(!product || product.length==0){
            errors.push(`Product is not available`);
          }
          if(product[0].quantity==0){
            errors.push(`${product[0].name} is out of stock`);
          }
          
          if(product[0].quantity > 0 && product[0].quantity < productDetails.qty){
            errors.push(`Available quantity is ${product[0].quantity} for ${product[0].name}`);
          }
          const profit = (productDetails.totalPrice - (productDetails.totalPrice * product[0].margin) / 100)
          let commissionGiven = 0;
          let commissionPercent = 0;
          if(isEligibleToRecieveCommission){
            if(product[0].overrideCommission){
              if(user.role == 'architect' || (user.referedBy as User).role == 'architect'){
                commissionGiven = (productDetails.totalPrice * product[0].architect) / 100;
                commissionPercent = product[0].architect;
              }
              else if(user.role == 'interiorDesigner' || (user.referedBy as User).role == 'interiorDesigner'){
                commissionGiven = (productDetails.totalPrice * product[0].interiorDesigner) / 100;
                commissionPercent = product[0].interiorDesigner;
              }
              else if(user.role == 'karagir' || (user.referedBy as User).role == 'karagir'){
                commissionGiven = (productDetails.totalPrice * product[0].karagir) / 100;
                commissionPercent = product[0].karagir;
              }
            }
            else{
              if(product[0].subcategory.length>0){
  
                const commission = getMeSubCategories(product[0].subcategory[0]);
  
                if(user.role == 'architect' || (user.referedBy as User).role == 'architect'){
                  const archCommission = commission.filter(ele=>ele.label==="Architect")[0]?.value;
                  commissionGiven = (productDetails.totalPrice * archCommission || 0) / 100;
                  commissionPercent = archCommission;
                }
                else if(user.role == 'interiorDesigner' || (user.referedBy as User).role == 'interiorDesigner'){
                  const interiorDesignerCommission = commission.filter(ele=>ele.label==="Interior Designer")[0]?.value;
                  commissionGiven = (productDetails.totalPrice * interiorDesignerCommission || 0) / 100;
                  commissionPercent = interiorDesignerCommission;
                }
                else if(user.role == 'karagir' || (user.referedBy as User).role == 'karagir'){
                  const karagirCommission = commission.filter(ele=>ele.label==="Karagir")[0]?.value;
                  commissionGiven = (productDetails.totalPrice * karagirCommission || 0) / 100;
                  commissionPercent = karagirCommission;
                }
              }
            }
          }
          
          productDetails.profit = profit;
          productDetails.commission = commissionGiven;

          if(isEligibleToRecieveCommission && commissionGiven>0){
            commisionPerProduct.push({
              productName: product[0].name,
              category: product[0].subcategory[0], 
              commissionInPercent: commissionPercent, 
              commision: commissionGiven
            });
          };

          return {
            productId: productDetails.productId,
            qty: productDetails.qty,
            dimensions: productDetails.dimensions,
            price: productDetails.totalPrice,
            fabric: productDetails.fabric || null,
            foam: productDetails.foam || null,
            profit: profit || null,
            commission: commissionGiven || null,
            isOrderCancelled: false,
            isMoneyRefunded: false,
            orderStatus: "received" as const,
            estimatedDeliveryDate: getDate("deliveryDate").toString(),
            updatedAt: getDate("today").toString(),
          };

        }))
      } 
      catch (error) {
        return { success : false, orderId: null, errors: ["Something went wrong!"] };
      }

      if(errors.length>0){
        return { success : false, orderId: null, errors: errors };
      }

      try {
        const {docs: defaultAddress} = await payload.find({
          collection: 'addresses',
          where:{
            user:{
              equals: user.id
            },
            isDefaultAddress: {
              equals: true
            }
          },
          limit: 1
        });
        const CODOrdersFakeOrderId = `COD_${new Date().toISOString().replace(/[^a-zA-Z0-9]/g, '')}`;
        await createOrder(payload, (defaultAddress as unknown as Address[] )[0], CODOrdersFakeOrderId, data, totalCartPrice, user.id, 'cashOnDelivery')
        await updateProductQty(payload, data, productsWithNewQty);
        
        if(isEligibleToRecieveCommission && commisionGoesTo){
          const lastEntry = await getLastEntryFromCommissionLedger(
            payload, 
            commisionGoesTo
          )
          
          let newBalance = lastEntry[0]?.balance || 0;
          
          if(lastEntry && lastEntry.length>0){
            await iterateAndSaveCommisionPerProduct(payload, commisionPerProduct, newBalance, user, commisionGoesTo);
          }
          else{
            await iterateAndSaveCommisionPerProduct(payload, commisionPerProduct, newBalance, user, commisionGoesTo);
          }
        }

        return { success : true, orderId: CODOrdersFakeOrderId, errors: errors }

      } catch (err) {
        console.log(err)
        return { success : false, orderId: null, errors: errors };
      }
    }),
  
  markOrderAsPaid: privateProcedure
    .input(RezorpaySuccessResponseValidator)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx
      try {
        if (!input.orderId || !input.razorpay_order_id) {
          throw new TRPCError({ code: 'BAD_REQUEST' })
        }
        const {commisionPerProduct, commisionGoesTo, isEligibleToRecieveCommission} = input;

        const payload = await getPayloadClient()

        const {docs} = await payload.find({
          collection: 'orders',
          depth:2,
          where:{
            orderId:{
              equals: input.orderId
            },
            user:{
              equals: user.id
            }
          }
        });

        const order = docs as unknown as Order[];
        const productsWithNewQty:ProductsWithNewQty[] = [];

        order[0].data.forEach(product=>{
          if(typeof product.productId!='string'){
            const newQty = product.productId.quantity<0? -1 : product.productId.quantity - product.qty!;
            productsWithNewQty.push({productId: product.productId.id, newQty: newQty})
            product.productId = product.productId.id;
          }
        });

        await updateProductQty(payload, order[0].data, productsWithNewQty);

        await payload.update({
          collection: 'orders',
          data: {
            _isPaid: true,
          },
          where:{
            orderId:{
              equals: input.orderId
            },
            user:{
              equals: user.id
            }
          }
        });

        if(isEligibleToRecieveCommission && commisionGoesTo){
          const lastEntry = await getLastEntryFromCommissionLedger(
            payload, 
            commisionGoesTo
          )
          
          let newBalance = lastEntry[0]?.balance || 0;
          
          if(lastEntry && lastEntry.length>0){
            await iterateAndSaveCommisionPerProduct(payload, commisionPerProduct, newBalance, user, commisionGoesTo);
          }
          else{
            await iterateAndSaveCommisionPerProduct(payload, commisionPerProduct, newBalance, user, commisionGoesTo);
          }
        }

        return input.orderId;
      } 
      catch (error) {
        return null;
      }
    }),

  pollOrderStatus: privateProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      const { orderId } = input

      const payload = await getPayloadClient()

      const { docs: orders } = await payload.find({
        collection: 'orders',
        where: {
          id: {
            equals: orderId,
          },
        },
      })

      if (!orders.length) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      const [order] = orders

      return { isPaid: order._isPaid }
    }),

  deleteOrder: privateProcedure
    .input(z.object({ orderId: z.string() }))
    .mutation(async ({ input }) => {
      const { orderId } = input

      const payload = await getPayloadClient()
      try {
        await payload.delete({
          collection: 'orders',
          where: {
            orderId: {
              equals: orderId,
            },
          },
        });

        return { success: true };
        
      } catch (error) {
        return { success: false }
      }
    }),
})

export const createOrder = async (
  payload: Payload, defaultAddress: Address, 
  orderId:string, data: OrderItem[], totalCartPrice: number, 
  userId: string, paymentMode: 'online' | 'cashOnDelivery'
)=>{
  try {
    await payload.create({
      collection: 'orders',
      data: {
        _isPaid: false,
        orderId: orderId,
        address: defaultAddress.id,
        paymentMode: paymentMode,
        data: data,
        totalOrderValue: totalCartPrice,
        user: userId,
      },
    });
    return
  }
  catch (error) {
    throw new Error(error as string);
  }
}

export const createCommissionEntry = async (
  payload: Payload, description: string, credit:number, debit: number, balance: number,
  userId: string
)=>{
  try {
    const newRecord = await payload.create({
      collection: 'commissionLedger',
      data: {
        user: userId,
        description: description,
        credit: credit,
        debit : debit,
        balance: balance,
        isCompleted: false,
        isCancelled: false
      },
    });
    return newRecord;
  }
  catch (error) {
    throw new Error(error as string);
  }
}

export const iterateAndSaveCommisionPerProduct = async (
  payload: Payload, commisionPerProduct: any[], newBalance:number, user: User,
  commisionGoesTo: string
)=>{
  try {
    for(let i=commisionPerProduct.length-1; i>=0;i--){
      const entry = commisionPerProduct[i];
      newBalance = newBalance + entry.commision;
      let productName = "Na";
      if(entry.productName?.length>30){
        productName = entry.productName?.slice(0, 30);
      }else{
        productName = entry.productName?.slice(0, 30) + '...';
      }
      await createCommissionEntry(
        payload, 
        `Customer: ${user.email}, Percent: ${entry.commissionInPercent}%, Category: ${entry.category}, Product: ${productName}`,
        entry.commision,0, 
        newBalance, 
        commisionGoesTo
      );      
    }
    return
  }
  catch (error) {
    throw new Error(error as string);
  }
}

export const getLastEntryFromCommissionLedger = async (
  payload: Payload,
  userId: string
)=>{
  try {
    const {docs} = await payload.find({
      collection: 'commissionLedger',
      where: {
        user: {equals : userId},
      },
      sort: "-createdAt",
      limit: 1,
    });
    return docs as unknown as CommissionLedger[];
  }
  catch (error) {
    throw new Error(error as string);
  }
}

export const updateProductQty = async (
  payload: Payload, data: OrderItem[], 
  productsWithNewQty: ProductsWithNewQty[]
)=>{
  try {
    for(let i=0; i<data.length; i++){
      const productDetails = data[i];
      const productId = typeof productDetails.productId == 'string'? productDetails.productId: productDetails.productId.id;
      const newQty = productsWithNewQty.filter(ele=>productId===ele.productId)[0]?.newQty;
      if(newQty && !Number.isNaN(newQty)){
        const result = await payload.update({
          collection: 'products',
          data: {quantity: newQty},
          where:{
            id: {
              equals: productId
            }
          }
        });
      }
    }
    return
  }
  catch (error) {
    console.log(error)
    throw new Error(error as string);
  }
}
