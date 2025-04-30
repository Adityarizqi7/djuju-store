import Collapse from "@kunukn/react-collapse"
import { Link, usePage } from '@inertiajs/react'
import React, { useState, useEffect, useCallback, Fragment } from "react"
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/solid"

import '../../../scss/admin/component/_sidebar.scss'

import { navbarState } from '@/store/NavbarState'

export default function SidebarAdmin({auth}) {

    const { url } = usePage()

    const location = window.location.pathname;

    const [expand, setExpand] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const [activeText, setActiveText] = useState();

    const onInit = ({ state, style, node }) => {
        setIsOpen(true);
    };
    
    const getTargetNameWithCurrentUrl = () => {
        navbarState?.map(option => (
            url === option.link ?
                setActiveText(option.name)
            :
            option.child?.map(child => (
                url === child.link ?
                    setActiveText(child.name)
                :
                    false
            ))
        ))
    }

    const handleExpand = () => {
        setExpand(!expand)
    }

    const handleFocusInput = useCallback(
        event => {
            if ((event.ctrlKey || event.metaKey) && event.code === 'KeyB') {
                event.preventDefault()
                setExpand(!expand)
            }
        },
        [expand]
    )

    useEffect(() => {
        getTargetNameWithCurrentUrl()

        document.addEventListener('keydown', handleFocusInput)

        return () => {
            document.removeEventListener('keydown', handleFocusInput)
        }
        // eslint-disable-next-line
    }, [handleFocusInput, url, expand])

    return (
        <div className={`${expand ? 'md:w-[100px]' : 'md:w-[300px]'} left-content w-full sticky top-0 md:h-screen h-auto md:space-y-10 space-y-0 transition-all duration-200`}>
            <div className="first-left md:flex hidden items-center">
                <div className="logo-wrapper">
                    <div className="text-logo montserrat">
                        <h1 className='font-semibold text-[1.5rem] text-orange-400'>JujuMart</h1>
                        <h2>Toko Sembako</h2>
                    </div>
                </div>
            </div>
            <div className="second-left">
                <nav className="nav-dashboard">
                    {/* Mobile Navbar */}
                    <details className="md:hidden block inter w-full mr-[1rem]">
                        <summary className="summary-navside">
                            { activeText }
                        </summary>
                        <ul>
                            {
                                auth?.user?.role === 'owner' ?
                                navbarState
                                ?.filter(e => e?.access?.includes('owner'))
                                ?.map(option => (
                                    option?.hasOwnProperty('child') ?
                                        <Fragment key={option?.id}>
                                            <li  className="flex items-center justify-between cursor-pointer have-child" onClick={() => {
                                                setIsOpen(state => !state)
                                            }}>
                                                <h3>
                                                    { option?.name }
                                                </h3>
                                                {
                                                    isOpen ?
                                                        <ChevronRightIcon className="w-5 h-5 text-neutral-900" aria-hidden="true" />
                                                    :
                                                        <ChevronDownIcon className="w-5 h-5 text-neutral-900" aria-hidden="true" />
                                                }
                                            </li>
                                            <Collapse isOpen={!isOpen} onInit={onInit} style={{margin: 0}} elementType="div" className={`collapse-css-transition`}>
                                                    {
                                                        option?.child?.map( itemChild => (
                                                            <li key={itemChild?.id} className="inter">
                                                                <Link href={itemChild?.link} 
                                                                        className={ 
                                                                            url === itemChild?.link ? 'active-visit child-item' : ''
                                                                        }
                                                                >
                                                                    <h3 className='pl-3'>
                                                                        {itemChild?.name}
                                                                    </h3>
                                                                </Link>
                                                            </li>
                                                        ))
                                                    }
                                            </Collapse>
                                        </Fragment>
                                    :   
                                    <li key={option?.id}>
                                        <Link href={option?.link} 
                                            className={ url === option?.link ? 'active-visit' : ''
                                            }
                                        >{option?.name}</Link>
                                    </li>
                                ))
                                :
                                navbarState
                                ?.filter(e => e?.access?.includes('employee'))
                                ?.map(option => (
                                    option?.hasOwnProperty('child') ?
                                        <Fragment key={option?.id}>
                                            <li  className="flex items-center justify-between cursor-pointer have-child" onClick={() => {
                                                setIsOpen(state => !state)
                                            }}>
                                                <h3>
                                                    { option?.name }
                                                </h3>
                                                {
                                                    isOpen ?
                                                        <ChevronRightIcon className="w-5 h-5 text-neutral-900" aria-hidden="true" />
                                                    :
                                                        <ChevronDownIcon className="w-5 h-5 text-neutral-900" aria-hidden="true" />
                                                }
                                            </li>
                                            <Collapse isOpen={!isOpen} onInit={onInit} style={{margin: 0}} elementType="div" className={`collapse-css-transition`}>
                                                    {
                                                        auth?.user?.role === 'owner' ?
                                                        option?.child
                                                        ?.filter(e => e?.access?.includes('owner'))
                                                        ?.map( itemChild => (
                                                            <li key={itemChild?.id} className="inter">
                                                                <Link href={itemChild?.link} 
                                                                        className={ 
                                                                            url === itemChild?.link ? 'active-visit child-item' : ''
                                                                        }
                                                                >
                                                                    <h3 className='pl-3'>
                                                                        {itemChild?.name}
                                                                    </h3>
                                                                </Link>
                                                            </li>
                                                        ))
                                                        :
                                                        option?.child
                                                        ?.filter(e => e?.access?.includes('employee'))
                                                        ?.map( itemChild => (
                                                            <li key={itemChild?.id} className="inter">
                                                                <Link href={itemChild?.link} 
                                                                        className={ 
                                                                            url === itemChild?.link ? 'active-visit child-item' : ''
                                                                        }
                                                                >
                                                                    <h3 className='pl-3'>
                                                                        {itemChild?.name}
                                                                    </h3>
                                                                </Link>
                                                            </li>
                                                        ))
                                                    }
                                            </Collapse>
                                        </Fragment>
                                    :   
                                    <li key={option?.id}>
                                        <Link href={option?.link} 
                                            className={ url === option?.link ? 'active-visit' : ''
                                            }
                                        >{option?.name}</Link>
                                    </li>
                                ))
                            }
                            <li>
                                <Link
                                    className='py-4 font-medium flex items-center justify-between w-full'
                                    href={route('logout')}
                                    method="post"
                                    as='button'
                                >
                                    <span>{auth?.user?.name}</span>
                                    <i className="las la-cog text-[1.25rem] pr-2"></i>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className='py-4 text-red-500 font-medium flex items-center justify-between w-full'
                                    href={route('logout')}
                                    method="post"
                                    as='button'
                                >
                                    <span>Signout</span>
                                    <i className="las la-sign-out-alt text-[1.25rem] pr-2"></i>
                                </Link>
                            </li>
                        </ul>
                    </details>

                    {/* SideBar */}
                    <ul className={`${expand === true && 'pb-3'} space-y-7 md:block hidden overflow-y-auto`}>
                        {
                            auth?.user?.role === 'owner' ?
                            navbarState
                            ?.filter(e => e?.access?.includes('owner'))
                            ?.map(option => (
                                option?.hasOwnProperty('child') ?
                                    <Fragment key={option?.id}>
                                        <li className="nav-item-dashboard inter flex items-center justify-between cursor-pointer" onClick={() => {
                                            setIsOpen(state => !state)
                                        }}>
                                            <h3>
                                                { option?.name }
                                            </h3>
                                            {
                                                isOpen ?
                                                    <ChevronRightIcon className="w-5 h-5 text-neutral-100" aria-hidden="true" />
                                                :
                                                    <ChevronDownIcon className="w-5 h-5 text-neutral-100" aria-hidden="true" />
                                            }
                                        </li>
                                        <Collapse isOpen={!isOpen} onInit={onInit} style={{margin: 0}} elementType="div" className={`collapse-css-transition`}> 
                                        {
                                            auth?.user?.role === 'owner' ?
                                            option?.child
                                            ?.filter(e => e?.access?.includes('owner'))
                                            ?.map( itemChild => (
                                                <li key={itemChild?.id} className="nav-item-dashboard pt-6 pl-4 inter">
                                                    <Link href={itemChild?.link} 
                                                            className={
                                                                url === itemChild?.link ? 'active-visit' : ''
                                                            }
                                                    >
                                                        <h3>
                                                            {itemChild?.name}
                                                        </h3>
                                                    </Link>
                                                </li>
                                            ))
                                            :
                                            option?.child
                                            ?.filter(e => e?.access?.includes('employee'))
                                            ?.map( itemChild => (
                                                <li key={itemChild?.id} className="nav-item-dashboard pt-6 pl-4 inter">
                                                    <Link href={itemChild?.link} 
                                                            className={
                                                                url === itemChild?.link ? 'active-visit' : ''
                                                            }
                                                    >
                                                        <h3>
                                                            {itemChild?.name}
                                                        </h3>
                                                    </Link>
                                                </li>
                                            ))
                                        }
                                        </Collapse>
                                    </Fragment>
                                :
                                    <li key={option?.id} className="nav-item-dashboard inter">
                                        <Link href={option?.link} className={
                                                url === option?.link ? "active-visit" : ""
                                            }
                                        >
                                            <h3>{option?.name}</h3>
                                        </Link>
                                    </li>
                            ))
                            :
                            navbarState
                            ?.filter(e => e?.access?.includes('employee'))
                            ?.map(option => (
                                option?.hasOwnProperty('child') ?
                                    <Fragment key={option?.id}>
                                        <li className="nav-item-dashboard inter flex items-center justify-between cursor-pointer" onClick={() => {
                                            setIsOpen(state => !state)
                                        }}>
                                            <h3>
                                                { option?.name }
                                            </h3>
                                            {
                                                isOpen ?
                                                    <ChevronRightIcon className="w-5 h-5 text-neutral-100" aria-hidden="true" />
                                                :
                                                    <ChevronDownIcon className="w-5 h-5 text-neutral-100" aria-hidden="true" />
                                            }
                                        </li>
                                        <Collapse isOpen={!isOpen} onInit={onInit} style={{margin: 0}} elementType="div" className={`collapse-css-transition`}> 
                                        {
                                            auth?.user?.role === 'owner' ?
                                            option?.child
                                            ?.filter(e => e?.access?.includes('owner'))
                                            ?.map( itemChild => (
                                                <li key={itemChild?.id} className="nav-item-dashboard pt-6 pl-4 inter">
                                                    <Link href={itemChild?.link} 
                                                            className={
                                                                url === itemChild?.link ? 'active-visit' : ''
                                                            }
                                                    >
                                                        <h3>
                                                            {itemChild?.name}
                                                        </h3>
                                                    </Link>
                                                </li>
                                            ))
                                            :
                                            option?.child
                                            ?.filter(e => e?.access?.includes('employee'))
                                            ?.map( itemChild => (
                                                <li key={itemChild?.id} className="nav-item-dashboard pt-6 pl-4 inter">
                                                    <Link href={itemChild?.link} 
                                                            className={
                                                                url === itemChild?.link ? 'active-visit' : ''
                                                            }
                                                    >
                                                        <h3>
                                                            {itemChild?.name}
                                                        </h3>
                                                    </Link>
                                                </li>
                                            ))
                                        }
                                        </Collapse>
                                    </Fragment>
                                :
                                    <li key={option?.id} className="nav-item-dashboard inter">
                                        <Link href={option?.link} className={
                                                url === option?.link ? "active-visit" : ""
                                            }
                                        >
                                            <h3>{option?.name}</h3>
                                        </Link>
                                    </li>
                            ))
                        }   
                        <i onClick={handleExpand} className={`${expand ? 'bottom-10 right-[2.10rem]' : 'bottom-10 right-[6.5rem] text-[2rem]'} las la-arrows-alt-h absolute text-white p-2 rounded-full border border-white cursor-pointer hover:rotate-180 transition-transform duration-300`} />
                    </ul>
                </nav>
            </div>
        </div>
    )
}