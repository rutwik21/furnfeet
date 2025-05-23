'use client'

import { PRODUCT_CATEGORIES } from '@/config'
import { User } from '@/payload-types'
import { LogIn, Menu, UserPlus, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import UserAccountNav from './UserAccountNav'

const  MobileNav = ({user}:{user:User | null}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const pathname = usePathname()

  // whenever we click an item in the menu and navigate away, we want to close the menu
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // when we click the path we are currently on, we still want the mobile menu to close,
  // however we cant rely on the pathname for it because that won't change (we're already there)
  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      setIsOpen(false)
    }
  }

  // remove second scrollbar when mobile menu is open
  useEffect(() => {
    if (isOpen)
      document.body.classList.add('overflow-hidden')
    else document.body.classList.remove('overflow-hidden')
  }, [isOpen])

  if (!isOpen)
    return (
      <button
        type='button'
        onClick={() => setIsOpen(true)}
        className='lg:hidden relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400'>
        <Menu className='h-6 w-6' aria-hidden='true' />
      </button>
    )

  return (
    <div>
      <div className='relative z-40 lg:hidden'>
        <div className='fixed inset-0 bg-black bg-opacity-25' />
      </div>

      <div className='fixed overflow-y-scroll overscroll-y-none inset-0 z-40 flex'>
        <div className='w-4/5'>

          <div className='relative flex w-full max-w-sm flex-col overflow-y-auto bg-white pb-12 shadow-xl'>
            
            <div className='flex px-4 pb-2 pt-5'>
              <button
                type='button'
                onClick={() => setIsOpen(false)}
                className='relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400'>
                <X className='h-6 w-6' aria-hidden='true' />
              </button>
            </div>

            {
              user?
                <UserAccountNav user={user} />
              :<div className='space-y-6 border-t border-gray-200 px-4 py-6'>
                  <div className='flow-root'>
                    <Link
                      onClick={() => closeOnCurrent('/sign-in')}
                      href='/sign-in'
                      className='flex gap-2 -m-2 p-2 font-medium text-gray-900 pb-4 border-b'>
                      <LogIn />
                      Sign in
                    </Link>
                  </div>
                  <div className='flow-root'>
                    <Link
                      onClick={() => closeOnCurrent('/sign-up')}
                      href='/sign-up'
                      className='flex gap-2 -m-2 p-2 font-medium text-gray-900 pb-4 border-b'>
                      <UserPlus />
                      Sign up
                    </Link>
                  </div>

                </div>
            }

            <div className='mt-2'>
              <ul>
                {PRODUCT_CATEGORIES.map((category) => (
                  <li
                    key={category.label}
                    className=' px-4 pb-10'>
                    <div className='border-b border-gray-200'>
                      <div className='-mb-px flex'>
                        <p className='border-transparent text-gray-900 flex-1 whitespace-nowrap pb-2 border-b-2 text-base font-medium'>
                          {category.label}
                        </p>
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-x-4'>
                      {category.featured.map((item,i) => (
                        <div
                          key={i}
                          className='group relative text-sm'>
                          <Link
                            href={item.href}
                            className='mt-2 block font-medium text-gray-900'>
                            {item.name}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileNav
