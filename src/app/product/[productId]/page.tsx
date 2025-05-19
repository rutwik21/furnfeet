import AddToCartButton from '@/components/AddToCartButton'
import ImageSlider from '@/components/ImageSlider'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import ProductReel from '@/components/ProductReel'
import { PRODUCT_CATEGORIES } from '@/config'
import { getPayloadClient } from '@/get-payload'
import { formatPrice } from '@/lib/utils'
import { Check, Shield } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Product } from '@/payload-types'
import ProductPrice from '../../../components/product/productPrice'
import ProductPriceAndCart from '@/components/product/ProductPriceAndCart'

interface PageProps {
  params: {
    productId: string
  }
}

const BREADCRUMBS = [
  { id: 1, name: 'Home', href: '/' },
  { id: 2, name: 'Products', href: '/products' },
]

const Page = async ({ params }: PageProps) => {
  const { productId } = await params

  const payload = await getPayloadClient()

  const { docs: products } = await payload.find({
    collection: 'products',
    depth: 2,
    limit: 1,
    where: {
      id: {
        equals: productId,
      },
      approvedForSale: {
        equals: 'approved',
      },
    },
  })

  const [product] = products as unknown as Product[]
  
  if (!product) return notFound()

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === product.category
  )?.label

  const validUrls = product.images
    .map(({ image }) =>
      typeof image === 'string' ? image : image.url
    )
    .filter(Boolean) as string[]

    const price = typeof product.price != 'string'?product.price :null
    if(!price) return notFound();
    
  return (
    <MaxWidthWrapper className='bg-white'>
      <div className='bg-white'>
        <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 sm:pt-14 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8'>
          

          {/* Product images */}
          <div className='lg:max-w-lg lg:self-end'>
            
            <ol className='flex items-center space-x-2 my-4'>
              {BREADCRUMBS.map((breadcrumb, i) => (
                <li key={breadcrumb.href}>
                  <div className='flex items-center text-sm'>
                    <Link
                      href={breadcrumb.href}
                      className='font-medium text-sm text-muted-foreground hover:text-gray-900'>
                      {breadcrumb.name}
                    </Link>
                    {i !== BREADCRUMBS.length - 1 ? (
                      <svg
                        viewBox='0 0 20 20'
                        fill='currentColor'
                        aria-hidden='true'
                        className='ml-2 h-5 w-5 flex-shrink-0 text-gray-300'>
                        <path d='M5.555 17.776l8-16 .894.448-8 16-.894-.448z' />
                      </svg>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
            <div className='aspect-square rounded-lg'>
              <ImageSlider urls={validUrls} />
            </div>

          </div>

          
          {/* Product Details */}
          <div className='mt-2 lg:col-start-2 lg:row-span-2 lg:mt-8 lg:self-start'>
            <div className='mt-4'>
              <h1 className='text-xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
                {product.name} 
                <p className='text-base font-normal text-muted-foreground mt-1'>{label}</p>
                  {product.quantity>0 && product.quantity<10? 
                  <p className='text-red-700 text-sm font-normal tracking-wide mt-1'>Hurry! Only {product.quantity} left</p>
                  :null}
              </h1>
            </div>
            <ProductPriceAndCart product={product}/>
            
            {
              product.description?
              <section className='mt-4'>

                <p className='font-semibold mb-2'>Product Description:</p>

                <div className='space-y-2'>
                  {product.description.split('/n').map((e,i)=>{
                    return <p key={i} className='text-sm md:text-base p-0 m-0 text-muted-foreground'>{e}</p>
                  })}
                </div>

                {/* <div className='mt-6 flex items-center'>
                  <Check
                    aria-hidden='true'
                    className='h-5 w-5 flex-shrink-0 text-green-500'
                  />
                  <p className='ml-2 text-sm text-muted-foreground'>
                    Eligible for instant delivery
                  </p>
                </div> */}
              </section>:null
            }
            
          </div>
          
          
        </div>
      </div>

      <ProductReel
        href='/products'
        query={{ category: product.category, limit: 4 }}
        title={`Similar ${label}`}
        subtitle={`Browse similar high-quality ${label} just like '${product.name}'`}
      />
    </MaxWidthWrapper>
  )
}

export default Page
