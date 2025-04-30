import QRCode from "qrcode.react";
// import QRCode from "react-qr-code";
import AdminLayout from "@/Layouts/AdminLayout";
import { Link, useForm } from "@inertiajs/react";
import React, { useEffect, useRef, useState, useCallback } from "react";

import '../../../../scss/admin/product/_product.scss';

import Pagination from "@/Components/Pagination";
import DashboardLayout from '../DashboardLayout';
import { formatedCurrency } from "@/Utils/String";
import BtnPrimary from "@/Components/button/BtnPrimary";
import SuccessAlert from "@/Components/alert/SuccessAlert";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function Product({products}) {

    const inputRef = useRef()
    const { delete: destroy } = useForm()

    const [success, setSuccess] = useState(false)
    const [focusInput, setFocusInput] = useState(false)
    const [searchProduct, setSearchProduct] = useState('')

    const deleteProduct = async (e, id) => {
        e.preventDefault()
        destroy(route('product.delete', id), {
            onSuccess: () => {
                setSuccess(true)
            },
            onStart: () => {
                setSuccess(false)
            }
        });
    }

    const handleChangeSearchProductInput = useCallback(
        e => setSearchProduct(e.target.value),
        []
    )

    const deleteText = useCallback(() => setSearchProduct(''), [])

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

    function handleDownloadQRCode(e) {
        const canvas = e.currentTarget.querySelector('canvas');
        const link = document.createElement('a');
        link.download = `BRG -`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    useEffect(() => {
        document.addEventListener('keydown', handleFocusInput)

        return () => {
            document.removeEventListener('keydown', handleFocusInput)
        }
    }, [handleFocusInput])

    return (
        <div className="product-component">
            <div id="container_product">
                <div className="create-search-section mt-8 font-medium flex flex-wrap gap-6 justify-between items-center">
                    <div className='search-product montserrat xs:w-full xs:order-2 w-[45%]'>
                        <div className='box-search inter w-full'>
                            <input
                                type='text'
                                name='search-product'
                                autoComplete='off'
                                className={`bg-transparent pr-[3rem] focus:outline-none focus:ring-0 pl-0`}
                                placeholder='Cari barang yang terdapat pada daftar ...'
                                onChange={handleChangeSearchProductInput}
                                ref={inputRef}
                                value={searchProduct}
                            />
                            {searchProduct !== '' && (
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
                                        searchProduct !== '' ? 'hidden' : 'block'
                                    } inter absolute top-[1.15rem] right-0 text-[14px] font-semibold text-gray-400`}
                                >
                                    Ctrl K
                                </h1>
                            }
                        </div>
                    </div>
                    <BtnPrimary title={'Tambah Barang'} link={route('product.create')} className='9xs:w-full' />
                </div>
                {
                    success === true &&
                    <SuccessAlert msg_primary={'Berhasil dihapus! '} msg_detail={`Barang telah dihapus dari daftar.`} className={'mt-8 fixed right-4 top-0 xxs:left-4'} />
                }
                <div className="all-product-table mt-10 overflow-x-auto">
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
                                    Kode Barang
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Satuan
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Harga Jual
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Harga Kulak
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Stok
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    QR Code
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="montserrat">
                        {
                            products?.length < 1 ?
                            (
                                <tr className="bg-white border-b">
                                    <td colSpan={7} className="px-6 py-4 text-[1.25rem]">
                                        Data barang masih kosong, segera tambahkan.
                                    </td>
                                </tr>
                            )  
                            :
                            products
                            ?.filter(value => {
                                // eslint-disable-line array-callback-return
                                if (searchProduct === '')
                                    return value
                                if (
                                    value?.name
                                        ?.toLowerCase()
                                        .includes(
                                            searchProduct
                                                ?.toLowerCase()
                                                .trim()
                                        ) ||
                                   String(value.sell_price)
                                        ?.toLowerCase()
                                        .includes(
                                            searchProduct
                                                ?.toLowerCase()
                                                .trim()
                                        ) ||
                                    value?.unit
                                    ?.toLowerCase()
                                    .includes(
                                        searchProduct
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
                                            {e?.product_code}
                                        </td>
                                        <td className="px-6 py-4">
                                            {e?.unit === 'pcs' ? 'Piece' : e?.unit === 'kg' ? 'Kilogram' : 'Kotak'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {formatedCurrency(e?.sell_price)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {formatedCurrency(e?.initial_price)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {e?.stock}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div onClick={handleDownloadQRCode} style={{cursor: 'pointer'}}>
                                                <QRCode value={String(e?.id)} size={80} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center items-center gap-2">
                                                <Link href={route('product.edit', e?.id)}>
                                                    <PencilSquareIcon className="w-6 h-6 text-blue-600" />
                                                </Link>
                                                <button onClick={(el) => deleteProduct(el, e?.id)}>
                                                    <TrashIcon className="w-5 h-5 text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>

                    {/* <Pagination className='mt-6' links={products?.links}/> */}
                </div>
            </div>
        </div>
    )
}

Product.layout = page => (
    <AdminLayout title='Barang - Admin JujuMart' keyword='barang dagangan JujuMart' desc='Halaman untuk megelola barang atau produk dagangan yang ada pada JujuMart' >
        <DashboardLayout children={page} pageName="Barang" />
    </AdminLayout>
)