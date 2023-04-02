import { Fragment } from 'react'
import { Link } from '@inertiajs/react'
import { usePage } from '@inertiajs/react'
import { Menu, Transition } from '@headlessui/react'

import "../../../scss/admin/_dashboard.scss"

import { CurrentYear } from '@/Utils/Date'
import AdminLayout from '@/Layouts/AdminLayout'
import SidebarAdmin from '@/Pages/Admin/SidebarAdmin'
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function DashboardLayout({pageName = 'Dashboard', children}) {

    const { auth } = usePage().props
    
    return (
        <article className="dashboard-component">
            <section id="container_dashboard">
                <article className="content-wrapper md:flex-row flex-col">
                        <nav className="md:hidden bg-blue-base/95 text-neutral-100 flex flex-wrap navout-up-dash text-center font-semibold items-center justify-center px-2 py-3 w-full montserrat">
                            <div className="text-center montserrat">
                                <h1 className='font-semibold text-[1.5rem] text-orange-400'>DJUJU</h1>
                                <h2>Toko Sembako</h2>
                            </div>
                        </nav>
                        <SidebarAdmin auth={auth} />
                        <div className="right-content w-full flex flex-col">
                            <div className="content grow">
                                <nav className="md:flex hidden nav-up-dash poppins font-semibold items-center justify-between px-4 py-5 w-full border-b border-gray-200 grow">
                                    <h1>
                                        {pageName}
                                    </h1>
                                    <Menu>
                                        <Menu.Button className='flex items-center space-x-1 ui-open:text-blue-base'>
                                            <h1>{auth.user.name}</h1>
                                            <ChevronDownIcon className='w-5 h-5' />
                                        </Menu.Button>
                                        <Transition
                                            as={Fragment}
                                            enter='ease-out duration-300'
                                            enterFrom='opacity-0 scale-95'
                                            enterTo='opacity-100 scale-100'
                                            leave='ease-in duration-200'
                                            leaveFrom='opacity-100 scale-100'
                                            leaveTo='opacity-0 scale-95'
                                            >
                                            <Menu.Items className='absolute z-[3] right-5 rounded-[10px] w-[11rem] bg-white border border-solid border-neutral-200 top-[3.25rem] flex flex-col overflow-hidden shadow-own'>
                                            {
                                                auth?.user?.role === 'owner' &&
                                                <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                    className={`${active && 'bg-gray-200'} py-[12px] px-[10px] border-b border-neutral-200`}
                                                    href={route('user.dashboard')}
                                                    >
                                                        Setting
                                                    </Link>
                                                )}
                                                </Menu.Item>
                                            }
                                                <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                    className={`${active && 'bg-gray-200'} py-[12px] px-[10px] text-left`}
                                                    href={route('logout')}
                                                    method="post"
                                                    as='button'
                                                    >
                                                        Signout
                                                    </Link>
                                                )}
                                                </Menu.Item>
                                            </Menu.Items>                                            
                                        </Transition>
                                    </Menu>
                                </nav>
                                {children}
                            </div>
                            <footer className='mt-auto py-3 px-2 text-center border-t border-gray-200'>
                                <div className="box-copright-sosmed text-neutral-800 montserrat">
                                    <h1>© {CurrentYear()} - Toko Sembako Djuju. All Rights Reserved.</h1>
                                </div>
                            </footer>
                        </div>
                    </article>
                </section>
        </article>   
    )
}

DashboardLayout.layout = (page, title, keyword, desc) => <AdminLayout children={page} title={title || 'Dashboard - Admin Toko Sembako Djuju'} keyword={keyword || 'dashboard djuju, dashboard toko sembako djuju'} desc={desc || 'Dashboard untuk mengelola toko sembako djuju'} />