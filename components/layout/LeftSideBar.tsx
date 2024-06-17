"use client"


import SvgIcon from '@/svg/SvgIcon'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { navLinks } from '@/lib/costants'

const LeftSideBar = () => {
    const pathname = usePathname()

  return (
    <div className='h-screen left-0 top-0 sticky p-10 flex flex-col gap-16 bg-purple-200 shadow-xl max-lg:hidden'>
        <div className=' flex items-center '>
                <p className='font-bold text-purple-600 text-4xl'>Boutique <span className='text-black'>Admin</span></p>
        </div>

        <div className='flex flex-col gap-12'>
            {navLinks.map((link) => (
                <Link
                href={link.url}
                key={link.label}
                className={`flex gap-4 text-body-medium ${
                    pathname === link.url ? "text-purple-600" : "text-grey-1"}
                    `}
                >
                {link.icon} <p>{link.label}</p>
                </Link>
            ))}
        </div>

        <div className='flex gap-4 text-body-medium items-center'>
            <UserButton />
            <p>Editar Perfil</p>
        </div>
    </div>
  )
}

export default LeftSideBar