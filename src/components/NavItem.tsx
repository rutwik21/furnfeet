'use client'

import { PRODUCT_CATEGORIES } from '@/config'
import { Button } from './ui/button'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

type Category = (typeof PRODUCT_CATEGORIES)[number]

interface NavItemProps {
  category: Category
  handleOpen: () => void
  close: () => void
  isOpen: boolean
  isAnyOpen: boolean
}

const NavItem = ({
  isAnyOpen,
  category,
  handleOpen,
  close,
  isOpen,
}: NavItemProps) => {
  return (
    <div className='flex'>
      <div className='relative flex items-center'>
        <Button
          className='gap-1.5'
          onClick={handleOpen}
          variant={isOpen ? 'secondary' : 'ghost'}>
          {category.label}
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-all text-muted-foreground',
              {
                '-rotate-180': isOpen,
              }
            )}
          />
        </Button>
      </div>

      {isOpen ? (
        <div
          onClick={() => close()}
          className={cn(
            'absolute inset-x-0 top-full text-sm text-muted-foreground',
            {
              'animate-in fade-in-10 slide-in-from-top-5':
                !isAnyOpen,
            }
          )}>
          <div
            className='absolute inset-0 top-1/2 bg-white shadow'
            aria-hidden='true'
          />

          <div className='relative bg-white'>
            <div className='mx-auto max-w-7xl px-8'>
              <div className='grid grid-cols-5 gap-x-8 gap-y-10 py-16'>
                <div className='col-span-4 col-start-1 grid grid-cols-6 gap-x-2'>
                  {category.featured.map((item, i) => (
                    <div
                      onClick={() => close}
                      key={item.name}
                      className='group relative text-base sm:text-sm '>
                      

                      <Link
                        href={item.href}
                        className=' mb-2 block font-medium text-orange-700 hover:opacity-75'>
                        {item.name}
                      </Link>
                      {item.subCategories.map(subCategory =>{
                        return <div key={subCategory.name} >
                          <Link
                            href={subCategory.href}
                            className='m-1 block font-normal text-muted-foreground hover:opacity-75'>
                            {subCategory.name}
                        </Link>
                        </div>
                      })}
                    </div>
                  ))}
                </div>
                <div className='relative aspect-video overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75'>
                  <Image
                    src={category.categoryImgSrc}
                    alt='product category image'
                    fill
                    className='object-cover object-center'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default NavItem
