import Link from 'next/link'
import MaxWidthWrapper from './MaxWidthWrapper'
import NavItems from './NavItems'
import { buttonVariants } from './ui/button'
import Cart from './Cart'
import { getServerSideUser } from '@/lib/payload-utils'
import { cookies } from 'next/headers'
import UserAccountNav from './UserAccountNav'
import MobileNav from './MobileNav'
import Logo from '../../public/furnfeet_logo.png';
import Image from 'next/image'
import SearchBar from './SearchBar'

const Navbar = async () => {
  const nextCookies = cookies()
  const { user } = await getServerSideUser(await nextCookies);
  
  // console.log(nextCookies, user);

  return (
    <div className='bg-white sticky z-50 top-0 inset-x-0 h-16'>
      <header className='relative bg-white'>
        <MaxWidthWrapper>
          <div className='border-b border-gray-200'>
            <div className='flex h-16 items-center'>
              <MobileNav user={user} />

              <div className='ml-4 flex lg:ml-0 '>
                <Link href='/' >
                  <Image src={Logo} alt='logo' width={150} height={10} />
                </Link>
              </div>

              <div className='hidden md:block md:w-auto md:ms-96 '>
                <SearchBar className='lg:w-80 md:w-auto' />
              </div>

              <div className='ml-auto flex items-center'>
                <div className='hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6'>
                  {user ? null : (
                    <Link
                      href='/sign-in'
                      className={buttonVariants({
                        variant: 'ghost',
                      })}>
                      Sign in
                    </Link>
                  )}

                  {user ? null : (
                    <span
                      className='h-6 w-px bg-gray-200'
                      aria-hidden='true'
                    />
                  )}

                  {user ? (
                    <UserAccountNav user={user} />
                  ) : (
                    <Link
                      href='/sign-up'
                      className={buttonVariants({
                        variant: 'ghost',
                      })}>
                      Create account
                    </Link>
                  )}

                  {user ? (
                    <span
                      className='h-6 w-px bg-gray-200'
                      aria-hidden='true'
                    />
                  ) : null}

                  {user ? null : (
                    <div className='flex lg:ml-6'>
                      <span
                        className='h-6 w-px bg-gray-200'
                        aria-hidden='true'
                      />
                    </div>
                  )}

                  <div className='ml-4 flow-root lg:ml-6'>
                    <Cart />
                  </div>
                </div>
              </div>

              <div className='lg:hidden mr-4'>
                <Cart />
              </div>

            </div>
          </div>
          <div className='border-b border-gray-200 md:hidden lg:block'>
            <div className='hidden z-50 lg:ml-8 lg:block lg:self-stretch'>
              <NavItems />
            </div>
            <div className='md:hidden p-2'>
              <SearchBar />
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  )
}

export default Navbar