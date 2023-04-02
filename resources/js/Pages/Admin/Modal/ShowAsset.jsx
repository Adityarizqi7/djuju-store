import { Tooltip } from "@material-tailwind/react";
import { useForm, router, Link } from "@inertiajs/react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { ArrowLeftIcon, QrCodeIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useRef, useState, useCallback } from "react";

import '../../../../scss/admin/modal/_showasset.scss';

import { now, monthYM } from '@/Utils/Date';
import TextInput from "@/Components/TextInput";
import AdminLayout from "@/Layouts/AdminLayout";
import DashboardLayout from '../DashboardLayout';
import InputError from "@/Components/InputError";
import { Spin } from "@/Components/loading/Spin";
import InputLabel from "@/Components/InputLabel";
import SuccessAlert from "@/Components/alert/SuccessAlert";

export default function ShowAsset({products, modal}) {

    const inputRef = useRef()
    const formAssetRef = useRef()
    const inputProduct = useRef()
    const inputSubmitNote = useRef()
    
    const [formShow, setFormShow] = useState(true)
    const [scanShow, setScanShow] = useState(false)
    const [searchNote, setSearchNote] = useState('')
    const [focusInput, setFocusInput] = useState(false)
    const [changeInput, setChangeInput] = useState(false)
    const [searchProduct, setSearchProduct] = useState('')

    const [successEdit, setSuccessEdit] = useState(false)
    
    const { data, setData, put, errors, processing } = useForm({
        product_id: modal?.product_id !== null ? modal?.product_id : '',
        product_name: modal?.product_name !== null ? modal?.product_name : '',
        initial_price: modal?.initial_price,
        asset_time: modal?.asset_time,
        purchase_amount: modal?.purchase_amount,
        cost_total: modal?.cost_total,
    })

    const handleScannerDialog = () => {setScanShow(!scanShow)}

    const deleteText = useCallback(() => setSearchNote(''), [])

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
        const costTotal = data.purchase_amount * data.initial_price;
        setData(prevData => ({ ...prevData, cost_total: costTotal }));
    }, [data.purchase_amount, data.initial_price]);
    
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        if (name === 'product_id') {
          const product = products.find((p) => p.id === parseInt(value));
          setData(prevData => ({ ...prevData, [name]: value, initial_price: product?.initial_price || '' }));
        } else {
          setData(prevData => ({ ...prevData, [name]: value }));
        }
    };

    const handleSearchProductChange = (e) => {
        setSearchProduct(e.target.value)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('asset.update', modal?.id), {
            onSuccess() {
                setSuccessEdit(true)
            },
            onStart() {
                setSuccessEdit(false)
            }
        })
    };

    useEffect(() => {

        document.addEventListener('keydown', handleFocusInput)

        return () => {
            document.removeEventListener('keydown', handleFocusInput)
        }
    }, [handleFocusInput, products, data?.product_id])

    return (
        <div className="show-asset-component">
            <div id="container_show_asset">
                <Link href={route('asset.dashboard')} className='back-section mt-8 flex items-center gap-x-2'>
                    <ArrowLeftIcon className='w-6 h-6' />
                    <h3 className="montserrat font-medium">Daftar Modal</h3>
                </Link>
                {
                    successEdit === true &&
                    <SuccessAlert msg_primary={'Berhasil diubah! '} msg_detail={`Ddata Modal telah diubah.`} className={'mt-8'} />
                }
                {
                    scanShow === true &&
                    <>  
                        <div className="mt-10 border border-gray-600 p-3 3xs:w-full w-[300px] rounded-md">
                            <BarcodeScannerComponent
                                width={400}
                                height={400}
                                delay={1000}
                                facingMode='user'
                                onUpdate={(err, result) => {
                                    if(result) {
                                        setData(prevState => ({ ...prevState, product_id: result.text }));
                                        // inputSubmitNote.current.click() Submit Otomatis
                                    }
                                }}
                            />
                        </div>
                    </>
                }
                <div className="form-control mt-10 relative z-[6]">
                    <input type="text" name='search-product' id="search-product" className='rounded-[5px] montserrat w-full' placeholder='Cari informasi barang' onChange={handleSearchProductChange} value={searchProduct} />
                    {
                        searchProduct !== '' &&
                        <div className="absolute z-[2] top-14 bg-white shadow-own rounded-[5px] p-3 montserrat w-[100%]"> 
                            <table>
                                <tbody>
                                {
                                    products
                                    ?.filter(value => {
                                        // eslint-disable-line array-callback-return
                                        if (
                                            value?.name
                                                ?.toLowerCase()
                                                .includes(
                                                    searchProduct
                                                        ?.toLowerCase()
                                                        .trim()
                                                )
                                            ||
                                            String(value?.id)
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
                                    ?.map((e, id) => {
                                        return (
                                            <tr key={id + 1}>
                                                <td className="px-1 py-2">
                                                    <h1 className='px-2 rounded-full bg-blue-600 text-white'>{e?.id}</h1>
                                                </td>
                                                <td className="px-2">
                                                    <h1>{e?.name}</h1>
                                                </td>
                                                <td className="px-2">
                                                    <h1>({e?.unit})</h1>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </table>
                        </div>
                    }
                </div>
                {
                    formShow &&
                    <form onSubmit={handleSubmit} action='post' ref={formAssetRef} id='form_asset' name="form_asset" className="mt-10 space-y-6">
                        <div className="form-group xxs:flex gap-6 xxs:items-stretch xxs:flex-col grid grid-cols-2">
                            <div className="form-control flex-1 flex flex-wrap gap-2 items-center">
                            {
                                changeInput === false ?
                                <div className='form-control flex-1'>
                                    <InputLabel classStar='hidden' htmlFor="product_id" value="ID Barang" className='text-[1.15rem] mb-3' />
                                    <input type="number" name='product_id' id="product_id" ref={inputProduct} onChange={handleOnChange} value={
                                        data?.product_id
                                    } className={`${data?.product_name !== '' && 'pointer-events-none opacity-30'} rounded-[5px] montserrat w-full`} placeholder='ID barang' />
                                    <InputError message={errors.hasOwnProperty('product_id') === true && errors?.product_id} className={`${errors?.product_id && 'block'} mt-2 xxs:w-full`} />
                                </div>
                                :
                                <div className='form-control flex-1'>
                                    <InputLabel classStar='hidden' htmlFor="product_id" value="ID Barang" className='text-[1.15rem] mb-3' />
                                    <select name="product_id" id="product_id" className='rounded-[5px] montserrat w-full' onChange={handleOnChange}>
                                        <option value="">Pilih dengan nama barang</option>
                                    {
                                        products?.map(e => {
                                            return (
                                                <option key={e?.id} className='py-2 px-1' value={e?.id}>{e?.name}</option>
                                            )
                                        })
                                    }
                                    </select>
                                    <InputError message={errors.hasOwnProperty('product_id') === true && errors?.product_id} className={`${errors?.product_id && 'block'} mt-2 xxs:w-full`} />
                                </div>
                            }
                                <Tooltip
                                    className='montserrat'
                                    content={'Ubah mode'}
                                    animate={{
                                        mount: { scale: 1, y: 0 },
                                        unmount: { scale: 0, y: 25 },
                                    }}
                                    >
                                    <i className="las la-sync text-[1.75rem] cursor-pointer" onClick={() => setChangeInput(!changeInput)}></i>
                                </Tooltip>
                            </div>
                            <div className='form-control flex-1'>
                                <InputLabel classStar='hidden' htmlFor="product_name" value="Nama Modal" className='text-[1.15rem] mb-3' />
                                <TextInput
                                    id="product_name"
                                    type="text"
                                    name="product_name"
                                    value={data?.product_name}
                                    autoComplete='on'
                                    placeholder='Nama modal'
                                    onChange={handleOnChange}
                                    className={`${errors.hasOwnProperty('product_name') === true && ' border border-solid border-red-500'} ${data?.product_id !== '' && 'pointer-events-none opacity-30'} w-full`}
                                />
                                <InputError message={
                                    errors.hasOwnProperty('product_name') === true &&
                                    errors?.product_name
                                } className={`${errors?.product_name && 'block'} mt-2 w-[20rem] xxs:w-full`} />
                            </div>
                            <div className='form-control flex-1'>
                                <InputLabel classStar='hidden' htmlFor="initial_price" value="Harga Kulak" className='text-[1.15rem] mb-3' />
                                <input type="number" name='initial_price' id="initial_price" onChange={handleOnChange} value={
                                    data?.initial_price
                                } className='rounded-[5px] montserrat w-full' placeholder='Harga Kulak' readOnly={
                                    `${
                                        products.find((p) => p.id === parseInt(data?.product_id))
                                        && true
                                    }`
                                } />
                                <InputError message={
                                    errors.hasOwnProperty('initial_price') === true &&
                                    errors?.initial_price
                                } className={`${errors?.initial_price && 'block'} mt-2 xxs:w-full`} />
                            </div>
                            <div className='form-control flex-1'>
                                <InputLabel classStar='hidden' htmlFor="purchase_amount" value="Jumlah Barang" className='text-[1.15rem] mb-3' />
                                <input type="number" name='purchase_amount' id="purchase_amount" onChange={handleOnChange} value={
                                    data?.purchase_amount
                                } className='rounded-[5px] montserrat w-full' placeholder='Jumlah Barang' />
                                <InputError message={
                                    errors.hasOwnProperty('purchase_amount') === true &&
                                    errors?.purchase_amount
                                } className={`${errors?.purchase_amount && 'block'} mt-2 xxs:w-full`} />
                            </div>
                            <div className='form-control flex-1'>
                                <InputLabel classStar='hidden' htmlFor="cost_total" value="Total Biaya" className='text-[1.15rem] mb-3' />
                                <input type="number" name='cost_total' id="cost_total" onChange={handleOnChange} value={
                                    data?.cost_total
                                } className='rounded-[5px] montserrat w-full' placeholder='Total Biaya' readOnly={
                                    true
                                } />
                                <InputError message={
                                    errors.hasOwnProperty('cost_total') === true &&
                                    errors?.cost_total
                                } className={`${errors?.cost_total && 'block'} mt-2 xxs:w-full`} />
                            </div>
                            <div className='form-control flex-1'>
                                <InputLabel classStar='hidden' htmlFor="month" value="Bulan Modal" className='text-[1.15rem] mb-3' />
                                <input type="month" id="month" name='asset_time' value={data?.asset_time} onChange={handleOnChange} className='montserrat rounded-[5px] w-full bg-blue-600 border-0 text-white' />
                                <InputError message={
                                    errors.hasOwnProperty('asset_time') === true &&
                                    errors?.asset_time
                                } className={`${errors?.asset_time && 'block'} mt-2 w-[30rem] xxs:w-full`} />
                            </div>
                        </div>
                        <button className={` ${processing && ' pointer-events-none'} focus:outline-none bg-blue-200 hover:bg-blue-500 text-blue-800 hover:text-white transition-colors duration-200 montserrat px-3 py-2 rounded-[5px] w-full`} ref={inputSubmitNote} disabled={processing}>
                            {
                                processing ? <Spin /> :  'Perbarui Modal'
                            }
                        </button>
                    </form>
                }
            </div>
        </div>
    )
}

ShowAsset.layout = page => (
    <AdminLayout title='Ubah Modal - Admin Toko Sembako Djuju' keyword='ubah modal dagangan toko sembako djuju' desc='Halaman untuk mengelola modal dagangan yang ada pada Toko Sembako Djuju' >
        <DashboardLayout children={page} pageName="Ubah Modal" />
    </AdminLayout>
)