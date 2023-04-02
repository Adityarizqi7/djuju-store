import { Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import React, { useEffect, useRef, useState, useCallback } from "react";

import '../../../../scss/admin/user/_user.scss';

import Pagination from "@/Components/Pagination";
import DashboardLayout from '../DashboardLayout';
import BtnPrimary from "@/Components/button/BtnPrimary";
import SuccessAlert from "@/Components/alert/SuccessAlert";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function User({users}) {

    const inputRef = useRef()
    const { delete: destroy } = useForm()

    const [success, setSuccess] = useState(false)
    const [searchUser, setSearchUser] = useState('')
    const [focusInput, setFocusInput] = useState(false)

    const deleteUser = async (e, id) => {
        e.preventDefault()
        destroy(route('user.delete', id), {
            onSuccess: () => {
                setSuccess(true)
            },
            onStart: () => {
                setSuccess(false)
            }
        });
    }

    const handleChangeSearchProductInput = useCallback(
        e => setSearchUser(e.target.value),
        []
    )

    const deleteText = useCallback(() => setSearchUser(''), [])

    const handleFocusInput = useCallback(
        event => {
            if ((event.ctrlKey || event.metaKey) && event.code === 'KeyK') {
                setFocusInput(true)
                event.preventDefault()
                inputRef.current.focus()
            }
            if (event.code === 'Escape') inputRef.current.blur() || deleteText()
        },
        [inputRef, deleteText]
    )

    useEffect(() => {
        document.addEventListener('keydown', handleFocusInput)

        return () => {
            document.removeEventListener('keydown', handleFocusInput)
        }
    }, [handleFocusInput])

    return (
        <div className="user-component">
            <div id="container_user">
                <div className="create-search-section mt-8 font-medium flex flex-wrap gap-6 justify-between items-center">
                    <div className='search-user montserrat xs:w-full xs:order-2 w-[45%]'>
                        <div className='box-search inter w-full'>
                            <input
                                type='text'
                                name='search-user'
                                autoComplete='off'
                                className={`bg-transparent pr-[3rem] focus:outline-none focus:ring-0 pl-0`}
                                placeholder='Cari pengguna yang terdapat pada daftar ...'
                                onChange={handleChangeSearchProductInput}
                                ref={inputRef}
                                value={searchUser}
                            />
                            {searchUser !== '' && (
                                <>
                                    <kbd
                                        onClick={deleteText}
                                        className='montserrat absolute top-[0.85rem] right-0 hidden cursor-pointer rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 sm:block'
                                    >
                                        Esc
                                    </kbd>
                                    <kbd
                                        onClick={deleteText}
                                        className='montserrat absolute top-[0.85rem] right-0 block cursor-pointer rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 sm:hidden'
                                    >
                                        Del
                                    </kbd>
                                </>
                            )}
                            {
                                <h1
                                    onClick={() => inputRef.current.focus()}
                                    className={`${
                                        searchUser !== '' ? 'hidden' : 'block'
                                    } inter absolute top-[1.15rem] right-0 text-[14px] font-semibold text-gray-400`}
                                >
                                    Ctrl K
                                </h1>
                            }
                        </div>
                    </div>
                    <BtnPrimary title={'Daftarkan Pegawai'} link={route('user.create')} className='9xs:w-full' />
                </div>
                {
                    success === true &&
                    <SuccessAlert msg_primary={'Berhasil diapus! '} msg_detail={`User telah dihapus dari daftar.`} className={'mt-8 fixed right-4 top-0 xxs:left-4'} />
                }
                <div className="all-user-table mt-10 overflow-x-auto">
                    <table className="w-full text-[1.05rem] text-center text-neutral-800">
                        <thead className="text-white uppercase bg-orange-600 poppins">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Nomor
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Nama
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Alamat
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Telepon
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Role
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="montserrat">
                        {
                            users?.length < 1 ?
                            (
                                <tr className="bg-white border-b">
                                    <td colSpan={7} className="px-6 py-4 text-[1.25rem]">
                                        Data user masih kosong, segera tambahkan.
                                    </td>
                                </tr>
                            )  
                            :
                            users
                            ?.filter(value => {
                                // eslint-disable-line array-callback-return
                                if (searchUser === '')
                                    return value
                                if (
                                    value?.name
                                        ?.toLowerCase()
                                        .includes(
                                            searchUser
                                                ?.toLowerCase()
                                                .trim()
                                        ) ||
                                   String(value.phone)
                                        ?.toLowerCase()
                                        .includes(
                                            searchUser
                                                ?.toLowerCase()
                                                .trim()
                                        )
                                ) {
                                    return value
                                }
                            })
                            ?.map( (e, i) => {
                                return (
                                    <tr key={i + 1} className="bg-white border-b">
                                        <td className="px-6 py-4">
                                            {i + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            {e?.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {e?.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            {e?.address}
                                        </td>
                                        <td className="px-6 py-4">
                                            {e?.phone}
                                        </td>
                                        <td className="px-6 py-4 ">
                                            {e?.role === 'owner' ? 'Admin' : 'Pegawai' }
                                        </td>
                                        <td className="px-6 py-4 flex justify-center items-center space-x-2">
                                            <Link href={route('user.edit', e?.id)}>
                                                <PencilSquareIcon className="w-6 h-6 text-blue-600" />
                                            </Link>
                                            <button onClick={(el) => deleteUser(el, e?.id)}>
                                                <TrashIcon className="w-5 h-5 text-red-500" />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>

                    <Pagination className='mt-6' links={users?.links}/>
                </div>
            </div>
        </div>
    )
}

User.layout = page => (
    <AdminLayout title='Pengguna - Admin Toko Sembako Djuju' keyword='pengguna aplikasi pada toko sembako djuju' desc='Halaman untuk megelola pengguna aplikasi (Pegawai atau Admin) yang ada pada Toko Sembako Djuju' >
        <DashboardLayout children={page} pageName="Pengguna" />
    </AdminLayout>
)