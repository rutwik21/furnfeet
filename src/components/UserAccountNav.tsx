'use client'

import { User } from '@/payload-types'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { User2,  Users, ScrollText, LogOut } from 'lucide-react'

const UserAccountNav = ({ user }: { user: User }) => {
  const { signOut } = useAuth()

  return (
    <>
      <div className='hidden md:block'>
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className='overflow-visible'>
            <Button
              variant='ghost'
              size='sm'
              className='relative'>
              My account
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className='bg-white w-60'
            align='end'>
            <div className='flex items-center justify-start gap-2 p-2'>
              <div className='flex flex-col space-y-0.5 leading-none'>
                <p className='font-medium text-sm text-black'>
                  {user.email}
                </p>
              </div>
            </div>

            <DropdownMenuSeparator />
            {
              user.role == "admin"?
              <DropdownMenuItem asChild>
                <Link href='/sell'>Seller Dashboard</Link>
              </DropdownMenuItem>
              :null
            }
            {
              user.role == "admin" || user.role == 'architect' || user.role =='interiorDesigner' || user.role == 'karagir' ?
              <DropdownMenuItem asChild>
                <Link href='/commission'>Referral program</Link>
              </DropdownMenuItem>
              :null
            }
            
            <DropdownMenuItem asChild>
              <Link href='/orderHistory'>Order History</Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={signOut}
              className='cursor-pointer'>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      
      <div className='md:hidden'>
        {
          user?
            <div className='flex gap-2 m-4 font-medium pb-4 border-b '>
              <User2 />
              {user.email}
            </div>
          :null
        }
        {
          user.role == "admin"?
          <div className='m-4 font-medium pb-4 border-b'>
            <Link href='/sell'>Seller Dashboard</Link>
          </div>
          :null
        }
        {
          user.role == "admin" || user.role == 'architect' || user.role =='interiorDesigner' || user.role == 'karagir' ?
          <div className='flex gap-2 m-4 font-medium pb-4 border-b'>
            <Users />
            <Link href='/commission'>Referral program</Link>
          </div>
          :null
        }
        
        <div className='flex gap-2 m-4 font-medium pb-4 border-b'>
          <ScrollText />
          <Link href='/orderHistory'>Order History</Link>
        </div>

        <div
          onClick={signOut}
          className='cursor-pointer flex gap-2 m-4 font-medium pb-4 border-b sticky bottom-0'>
            <LogOut />
            Log out
        </div>
      </div>
    </>
  )
}

export default UserAccountNav
