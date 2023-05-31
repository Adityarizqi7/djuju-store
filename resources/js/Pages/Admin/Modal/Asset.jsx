import { useForm, Link } from "@inertiajs/react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import React, { useEffect, useRef, useState, useCallback } from "react";

import '../../../../scss/admin/modal/_asset.scss';

import TextInput from "@/Components/TextInput";
import AdminLayout from "@/Layouts/AdminLayout";
import DashboardLayout from '../DashboardLayout';
import InputError from "@/Components/InputError";
import { Spin } from "@/Components/loading/Spin";
import { Tooltip } from "@material-tailwind/react";
import SuccessAlert from "@/Components/alert/SuccessAlert";
import { formatedCurrency, limitString } from "@/Utils/String";
import { now, monthYM, convertMonthReadble } from '@/Utils/Date';
import { PencilSquareIcon, QrCodeIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function Modal({products, modal}) {

    const inputRef = useRef()
    const formNoteRef = useRef()
    const inputProduct = useRef('')
    const inputSubmitNote = useRef()
    
    const [date, setDate] = useState(monthYM())
    const [formShow, setFormShow] = useState(true)
    const [scanShow, setScanShow] = useState(false)
    const [searchNote, setSearchNote] = useState('')
    const [focusInput, setFocusInput] = useState(false)
    const [changeInput, setChangeInput] = useState(false)
    const [searchProduct, setSearchProduct] = useState('')

    const [successCreate, setSuccessCreate] = useState(false)
    const [successDelete, setSuccessDelete] = useState(false)
    
    const { data, setData, post, errors, delete: destroy, processing } = useForm({
        product_id: '',
        product_name: '',
        initial_price: '',
        purchase_amount: '',
        cost_total: '',
        asset_time: monthYM(),
    })

    const handleScannerDialog = () => {setScanShow(!scanShow)}

    const deleteAsset = (e, id) => {
        e?.preventDefault()
        destroy(route('asset.delete', id), {
            preserveScroll: true,
            onSuccess: () => {
                setSuccessDelete(true)
            },
            onStart() {
                setSuccessDelete(false)
            }
        });
    }

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
          setData(prevData => ({ ...prevData, [name]: parseInt(value), initial_price: product?.initial_price || '' }));
        } else if (name === 'asset_time' || name === 'product_name') {
            setData(prevData => ({ ...prevData, [name]: value }));
        } else {
          setData(prevData => ({ ...prevData, [name]: parseInt(value) }));
        }
    };

    const handleSearchProductChange = (e) => {
        setSearchProduct(e.target.value)
    };

    const handleMonthChange = (event) => {
        setDate(event.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('asset.store'), {
            onSuccess() {
                setSuccessCreate(true)
                setData({product_id: '', product_name: '', initial_price: '', purchase_amount: '', cost_total: '', asset_time: monthYM()})
            },
            onStart() {
                setSuccessCreate(false)
            }
        })
    };

    useEffect(() => {

        document.addEventListener('keydown', handleFocusInput)

        return () => {
            document.removeEventListener('keydown', handleFocusInput)
        }
    }, [handleFocusInput, products, data?.product_id, data?.code_record])

    return (
        <div className="modal-component">
            <div id="container_modal">
                <div className="scan-date-section mt-8 font-medium flex flex-wrap gap-3 justify-between items-center">
                    <div className="scan-qrcode ml-auto static flex items-center gap-2">
                        <i onClick={() => setFormShow(!formShow)} className={`${formShow === true && 'rotate-45' } las la-plus text-[2.25rem] cursor-pointer`}></i>
                        <div>
                        {
                            scanShow === true &&
                            <span className="absolute flex h-3 w-3">
                                <span className="animate-ping absolute z-0 inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                        }
                            <QrCodeIcon className='w-10 h-10 text-neutral-900 cursor-pointer' onClick={handleScannerDialog} />
                        </div>
                    </div>
                </div>

                {
                    successDelete === true &&
                    <SuccessAlert msg_primary={'Berhasil dihapus! '} msg_detail={`Modal yang telah tercacat berhasil dihapus dari daftar.`} className={'mt-8 fixed z-[7] right-4 top-0 xxs:left-4'} />
                }
                {
                    successCreate === true &&
                    <SuccessAlert msg_primary={'Berhasil dicatat! '} msg_detail={`Modal telah dicatat.`} className={'mt-8'} />
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
                                        const productId = parseInt(result.text);
                                        const product = products.find((p) => p.id === productId);
                                        if (product) {
                                            setData(prevData => ({ ...prevData, product_id: productId, initial_price: product.initial_price || '' }));
                                        } else {
                                            setData(prevData => ({ ...prevData, product_id: productId }));
                                        }
                                        // inputSubmitNote.current.click() Submit Otomatis
                                    }
                                }}
                            />
                        </div>
                    </>
                }
                {
                    formShow &&
                    <form onSubmit={handleSubmit} action='post' ref={formNoteRef} id='form_note' name="form_note" className="mt-6 space-y-6 shadow-md px-4 py-8 rounded-[5px]">
                        <div className="form-group xxs:flex gap-6 xxs:items-stretch xxs:flex-col grid grid-cols-2">
                            {/* Button Submit Otomatis */}
                            {/* <button className='focus:outline-none bg-blue-200 text-blue-800 montserrat px-3 py-2 rounded-[5px]' ref={inputSubmitNote} onClick={e => formNoteRef.current.dispatchEvent(
                                new Event("submit")
                            )}>
                                Catat Barang
                            </button> */}
                            <div className="form-control flex-1 flex flex-wrap gap-2 items-center">
                            {
                                changeInput === false ?
                                <div className={`${data?.product_name !== '' && 'pointer-events-none opacity-30'} flex-1`}>
                                    <input type="number" name='product_id' id="product_id" ref={inputProduct} onChange={handleOnChange} value={
                                        data?.product_id
                                    } className='rounded-[5px] montserrat w-full' placeholder='ID barang' />
                                    <InputError message={errors.hasOwnProperty('product_id') === true && errors?.product_id} className={`${errors?.product_id && 'block'} mt-2 xxs:w-full`} />
                                </div>  
                                :
                                <div className={`${data?.product_name !== '' && 'pointer-events-none opacity-30'} flex-1`}>
                                    <select name="product_id" id="product_id" className='rounded-[5px] montserrat w-full' onChange={handleOnChange}>
                                    <option value="">Pilih dengan nama barang</option>
                                    {
                                        products?.map(e => {
                                            return (
                                                <option key={e?.id} className='py-2 px-1' value={e?.id}>{e?.name} - {formatedCurrency(e?.initial_price)}</option>
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
                            <div className={`${data?.product_id !== '' && 'pointer-events-none opacity-30'} form-control flex-1`}>
                                <TextInput
                                    id="product_name"
                                    type="text"
                                    name="product_name"
                                    value={data?.product_name}
                                    autoComplete='on'
                                    placeholder='Nama modal (selain barang dagangan)'
                                    onChange={handleOnChange}
                                    className={`${errors.hasOwnProperty('product_name') === true && 'border border-solid border-red-500'} w-full`}
                                />
                                <InputError message={
                                    errors.hasOwnProperty('product_name') === true &&
                                    errors?.product_name
                                } className={`${errors?.product_name && 'block'} mt-2 w-[20rem] xxs:w-full`} />
                            </div>
                            <div className={`form-control flex-1`}>
                                <input type="number" name='initial_price' id="initial_price" onChange={handleOnChange} value={
                                    data?.initial_price
                                } className='rounded-[5px] montserrat w-full' placeholder='Harga Kulak' />
                                <InputError message={
                                    errors.hasOwnProperty('initial_price') === true &&
                                    errors?.initial_price
                                } className={`${errors?.initial_price && 'block'} mt-2 xxs:w-full`} />
                            </div>
                            <div className={`form-control flex-1`}>
                                <input type="number" name='purchase_amount' id="purchase_amount" onChange={handleOnChange} value={
                                    data?.purchase_amount
                                } className='rounded-[5px] montserrat w-full' placeholder='Banyak benda' />
                                <InputError message={
                                    errors.hasOwnProperty('purchase_amount') === true &&
                                    errors?.purchase_amount
                                } className={`${errors?.purchase_amount && 'block'} mt-2 xxs:w-full`} />
                            </div>
                            <div className={`form-control flex-1`}>
                                <input type="number" name='cost_total' id="cost_total" onChange={handleOnChange} value={
                                    data?.cost_total
                                } className='rounded-[5px] montserrat w-full' placeholder='Total Biaya Kulak' readOnly={true} />
                                <InputError message={
                                    errors.hasOwnProperty('cost_total') === true &&
                                    errors?.cost_total
                                } className={`${errors?.cost_total && 'block'} mt-2 xxs:w-full`} />
                            </div>
                            <div className='form-control flex-1'>
                                <input type="month" id="month" name='asset_time' value={data?.asset_time} onChange={handleOnChange} className='montserrat rounded-[5px] w-full bg-blue-600 border-0 text-white' />
                                <InputError message={
                                    errors.hasOwnProperty('asset_time') === true &&
                                    errors?.asset_time
                                } className={`${errors?.asset_time && 'block'} mt-2 w-[30rem] xxs:w-full`} />
                            </div>
                        </div>
                        <button className={` ${processing && ' pointer-events-none'} focus:outline-none bg-blue-200 hover:bg-blue-500 text-blue-800 hover:text-white transition-colors duration-200 montserrat px-3 py-2 rounded-[5px] w-full`} ref={inputSubmitNote} disabled={processing}>
                            {
                                processing ? <Spin /> :  'Simpan Modal'
                            }
                        </button>
                    </form>
                }
                <div className="form-control mt-10 relative z-[6] flex gap-4 xxs:flex-col">
                    <div className="flex-1">
                        <input type="text" name='search-product' id="search-product" className='rounded-[5px] montserrat w-full' placeholder='Cari informasi barang (id, nama)' onChange={handleSearchProductChange} value={searchProduct} />
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
                    <input type="month" id="date" name='datekey' value={date} onChange={handleMonthChange} className='montserrat rounded-[5px] w-full bg-orange-500/95 border-0 text-white flex-1' />
                </div>
                <div className="all-asset-table mt-10 overflow-x-auto h-[37rem] overflow-y-auto">
                    <table className="w-full text-[1.05rem] text-center text-neutral-800">
                        <thead className="text-white uppercase poppins">
                            <tr className="bg-transparent border-x border-t border-b-0 border-orange-600">
                                <th scope="col" colSpan={8} className="px-6 py-6 text-neutral-900 text-[1.25rem]">
                                    Modal pada Bulan {convertMonthReadble(date)}
                                </th>
                            </tr>
                            <tr className="bg-orange-600/95 column-name">
                                <th scope="col" className="px-6 py-3">
                                    Nomor
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Bulan
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Nama Barang
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Satuan Barang
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Harga Kulak
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Jumlah Barang
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Total Biaya
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="montserrat">
                        {
                            modal?.length < 1 ?
                            (
                                <tr className="bg-white border-b">
                                    <td colSpan={8} className="px-6 py-6 text-[1.25rem] text-center">
                                         Tidak ada modal pada bulan
                                    </td>
                                </tr>
                            )  
                            : 
                            modal
                            ?.filter((value) => {
                                if (date) {
                                    if (value?.asset_time?.slice(0, 7) === date) return true;
                                    return false;
                                }
                                return true;
                            })
                            ?.map((ele, i) => {
                                return (
                                    <tr key={i + 1} className="bg-white border-b even:bg-slate-50">
                                        <td data-column='Nomor' className="px-3 py-4">
                                            {i + 1}
                                        </td>
                                        <td data-column='Bulan Modal' className="px-3 py-4">
                                            {convertMonthReadble(ele?.asset_time)}
                                        </td>
                                        <td data-column='Nama Barang' className="px-3 py-4">
                                        {
                                            ele?.product_id !== null &&
                                            ele?.product?.name
                                        }
                                        {
                                            ele?.product_name !== null &&
                                            limitString(ele?.product_name, 25)
                                        }
                                        </td>
                                        <td data-column='Satuan Barang' className="px-3 py-4">
                                        {
                                            ele?.product?.unit
                                        }
                                        </td>
                                        <td data-column='Harga Awal' className="px-3 py-4">
                                        {
                                            formatedCurrency(ele?.initial_price)
                                        }
                                        </td>
                                        <td data-column='Jumlah Barang' className="px-3 py-4">
                                        {
                                            ele?.purchase_amount
                                        }
                                        </td>
                                        <td data-column='Harga Barang' className="px-3 py-4">
                                        {
                                            formatedCurrency(ele?.cost_total)
                                        }
                                        </td>
                                        <td data-column='Aksi'>
                                            <div className="px-6 py-4 flex justify-center items-center space-x-2">
                                                <Link href={route('asset.edit', ele?.id)}>
                                                    <PencilSquareIcon className="w-6 h-6 text-blue-600" />
                                                </Link>
                                                <button onClick={(el) => deleteAsset(el, ele?.id)}>
                                                    <TrashIcon className="w-5 h-5 text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                        <tfoot>
                            <tr className='montserrat border-b bg-gray-100'>
                                <td colSpan={5} className='px-2 py-4 border-r border-gray-200 text-[1.25rem] font-semibold'>Total Modal</td>
                                <td colSpan={3} className='px-2 py-4 border-r border-gray-200 text-blue-800'>
                                {
                                    formatedCurrency(
                                        modal
                                        ?.filter((value) => {
                                            if (date) {
                                                if (value?.asset_time?.slice(0, 7) === date) return true;
                                                return false;
                                            }
                                            return true;
                                        })
                                        ?.reduce((total, asset) => total + asset?.cost_total, 0)
                                    )
                                }
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                {/* <Pagination className='mt-6' links={products?.links}/> */}
            </div>
        </div>
    )
}

Modal.layout = page => (
    <AdminLayout title='Modal - Admin Toko Sembako Djuju' keyword='modal dagangan toko sembako djuju' desc='Halaman untuk mengelola modal dagangan yang ada pada Toko Sembako Djuju' >
        <DashboardLayout children={page} pageName="Modal" />
    </AdminLayout>
)