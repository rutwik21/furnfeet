import HeroSlider from '@/components/HeroSlider'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import ProductReel from '@/components/ProductReel'
import {
  Button,
  buttonVariants,
} from '@/components/ui/button'
import {
  Truck,
  CheckCircle,
  Settings,
} from 'lucide-react'
import Link from 'next/link'

const perks = [
  {
    name: 'Fastest Delivery',
    Icon: Truck,
    description:
      'Get your products delivered to your home fastest way possible. As we only accept orders from the selected pincodes.',
  },
  {
    name: 'Guaranteed Quality',
    Icon: CheckCircle,
    description:
      'Every asset on our platform is verified by our team to ensure our highest quality standards.',
  },
  {
    name: 'Customised Furniture',
    Icon: Settings,
    description:
      "We offer customized furniture options according to your need.",
  },
]

const heroSlides = [
    {
      id: 1,
      image: '/hero1.jpg',
      ctaLink: '/products',
    },
    {
      id: 2,
      image: '/hero2.png', 
      ctaLink: '/products',
    },
    {
      id: 3,
      image: '/hero3.jpg',
      ctaLink: '/products',
    },
  ];

export default function Home() {
  return (
    <>
      <MaxWidthWrapper>
        <HeroSlider slides={heroSlides} />
        {/* <div className='py-20 mx-auto text-center flex flex-col items-center max-w-3xl'>
          <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl'>
            Your marketplace for high-quality{' '}
            <span className=' text-orange-500'>
              Home Furnishings
            </span>
            .
          </h1>
          <p className='mt-6 text-lg max-w-prose text-muted-foreground'>
            Welcome to FurnFeet. Every asset on our
            platform is verified by our team to ensure our
            highest quality standards.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 mt-6'>
            <Link
              href='/products'
              className={buttonVariants()}>
              Browse Trending
            </Link>
            <Button variant='ghost'>
              Our quality promise &rarr;
            </Button>
          </div>
        </div> */}

        <ProductReel
          query={{ sort: 'desc', limit: 4 }}
          href='/products?sort=recent'
          title='Brand new'
        />
      </MaxWidthWrapper>

      <section className='border-t border-gray-200 bg-gray-50'>
        <MaxWidthWrapper className='py-20'>
          <div className='grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0'>
            {perks.map((perk) => (
              <div
                key={perk.name}
                className='text-center md:flex md:items-start md:text-left lg:block lg:text-center'>
                <div className='md:flex-shrink-0 flex justify-center'>
                  <div className='h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-900'>
                    {<perk.Icon className='w-1/3 h-1/3' />}
                  </div>
                </div>

                <div className='mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6'>
                  <h3 className='text-base font-medium text-gray-900'>
                    {perk.name}
                  </h3>
                  <p className='mt-3 text-sm text-muted-foreground'>
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  )
}
