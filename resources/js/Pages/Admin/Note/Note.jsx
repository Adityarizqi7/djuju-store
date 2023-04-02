// import Hashids from "/node_modules/hashids";
import { Fragment } from "react";
import { Tooltip } from "@material-tailwind/react";
import { useForm, router, Link } from "@inertiajs/react";
import { BellAlertIcon } from "@heroicons/react/24/solid";
import { Popover, Transition, Dialog } from "@headlessui/react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { List, ListItem, SelectBox, SelectBoxItem } from "@tremor/react";
import { DocumentArrowUpIcon, PencilIcon, QrCodeIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

import '../../../../scss/admin/note/_note.scss';

import AdminLayout from "@/Layouts/AdminLayout";
import DashboardLayout from '../DashboardLayout';
import InputError from "@/Components/InputError";
import { Spin } from "@/Components/loading/Spin";
import { CurrentYear, now, dateNow } from '@/Utils/Date';
import SuccessAlert from "@/Components/alert/SuccessAlert";
import { formatedCurrency, limitString, randomStringCustom } from "@/Utils/String";

export default function Note({products, notes}) {

    const inputRef = useRef()
    const formNoteRef = useRef()
    const subTotalRef = useRef()
    const inputProduct = useRef()
    const inputSubmitNote = useRef()
    const formTransactionRef = useRef()
    
    const [isOpen, setIsOpen] = useState(false)
    const [scanShow, setScanShow] = useState(false)
    const [searchNote, setSearchNote] = useState('')
    const [focusInput, setFocusInput] = useState(false)
    const [changeInput, setChangeInput] = useState(false)
    const [searchProduct, setSearchProduct] = useState('')

    const [progressEdit, setProgressEdit] = useState(false)

    const [successEdit, setSuccessEdit] = useState(false)
    const [successSaved, setSuccessSaved] = useState(false)
    const [successCreate, setSuccessCreate] = useState(false)
    const [successDelete, setSuccessDelete] = useState(false)
    const [successTransaction, setSuccessTransaction] = useState(false)
    
    const [valueEditNote, setValueEditNote] = useState({
        purchase_amount: ''
    })

    const [valueCostSubtotal, setValueCostSubtotal] = useState({
        cost_subtotal: subTotalRef?.current?.['cost_subtotal']?.value
    })

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }
    
    const [valueTransaction, setValueTransaction] = useState({
        transaction_order: CurrentYear().toString().substring(2, 4)+(dateNow().getMonth() + 1)+dateNow().getDate()+randomStringCustom(9),
    })
    
    const { data, setData, post, errors, delete: destroy, processing } = useForm({
        product_id: '',
        purchase_amount: '',
        // CPB = Catatan Penjualan Barang
        code_record: 'CPB'+CurrentYear().toString().substring(2, 4)+(dateNow().getMonth() + 1)+dateNow().getDate()+randomStringCustom(2)
    })
    
    const valuesEmpty = () => {
        return data?.product_id === "" || data?.purchase_amount === "" || data?.code_record === ''
    }

    const handleScannerDialog = () => {setScanShow(!scanShow)}

    const deleteProduct = (e, id) => {
        e?.preventDefault()
        destroy(route('note.delete', id), {
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

    const handleOnChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value}
        );
        // handleSubmit(e)
    };

    const handleSearchProductChange = (e) => {
        setSearchProduct(e.target.value)
    };

    const handleChangeEditNote = (e) => {
        setValueEditNote({
            ...valueEditNote,
            [e.target.name]: e.target.value}
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('note.store'), {
            onSuccess() {
                setSuccessCreate(true)
                setData({product_id: '', code_record: 'CPB'+CurrentYear().toString().substring(2, 4)+dateNow().getMonth() + 1+dateNow().getDate()+randomStringCustom(2), purchase_amount: ''})
            },
            onStart() {
                setSuccessCreate(false)
            }
        })
    };

    const handleSubmitToTransaction = (e) => {
        e.preventDefault();
        router.put(`/note/finish`, valueTransaction ,{
            onSuccess() {
                setValueTransaction({
                    transaction_order: CurrentYear().toString().substring(2, 4)+(dateNow().getMonth() + 1)+dateNow().getDate()+randomStringCustom(9),
                })
                setSuccessTransaction(true)
            },
            onStart() {
                setSuccessTransaction(false)
            }       
        })
    }

    const handleEditPurchaseAmount = (e, id) => {
        e.preventDefault();
        router.put(`/note/${id}/update`, valueEditNote,{
            preserveScroll: true,
            onProgress() {
                setProgressEdit(true)
            },
            onSuccess() {
                setSuccessEdit(true)
                setValueEditNote({
                    purchase_amount: ''
                })
            },
            onStart() {
                setSuccessEdit(false)
                setProgressEdit(false)
            }
        })
    }

    const is_saved = (e, id) => {
        e.preventDefault()
        router.put(`/note/${id}/saved`, valueCostSubtotal ,{
            preserveScroll: true,
            onSuccess() {
                setSuccessSaved(true)
            },
            onStart() {
                setSuccessSaved(false)
            }
        })
    }

    useEffect(() => {

        document.addEventListener('keydown', handleFocusInput)

        return () => {
            document.removeEventListener('keydown', handleFocusInput)
        }
    }, [handleFocusInput, products, data?.product_id, data?.code_record])

    return (
        <div className="note-component">
            <div id="container_note">
            {
                products?.find(e => e?.stock < 1) &&
                <div className="mt-8 alert flex items-center 3xs:block bg-red-500 montserrat py-3 px-3 rounded-[10px] gap-2 text-white">
                    <BellAlertIcon className='w-6 h-6' />
                    <h1> Terdapat stok barang yang kosong, <u onClick={openModal} className='cursor-pointer'>Cek disini</u></h1>
                </div>
            }
                <Transition appear show={isOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-10" onClose={closeModal}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-25" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center montserrat">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="w-full max-w-2xl transform overflow-y-auto rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                        <Dialog.Title
                                            as="h1"
                                            className="text-lg font-semibold leading-6 text-gray-900"
                                        >
                                            Statistik Barang Yang Kosong
                                        </Dialog.Title>
                                        <List className="mt-3 space-y-2">
                                        {
                                            products
                                            ?.filter(e => e?.stock < 1)
                                            .map((e, id) => (
                                                <ListItem key={id} className='border-b border-gray-200'>
                                                    <h2 className='text-[1.05rem]'>
                                                        <strong>{`${id + 1}.`}</strong>{` ${e?.name}, `}
                                                        <Link href={route('product.edit', e?.id)}>
                                                            <u className='cursor-pointer text-blue-600 focus:border-0' autoFocus={false}>Lihat disini</u>
                                                        </Link>
                                                    </h2>
                                                </ListItem>
                                            ))
                                        }
                                        </List>
                                        <div className="mt-4">
                                            <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={closeModal}
                                            >
                                            Tutup
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
                <div className="scan-date-section mt-8 font-medium flex flex-wrap gap-3 justify-between items-center">
                    <div className="date montserrat">
                        <h2>{
                            now()
                        }</h2>
                    </div>
                    <div className="scan-qrcode ml-auto static">
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
                {
                    successDelete === true &&
                    <SuccessAlert msg_primary={'Berhasil dihapus! '} msg_detail={`Barang yang telah tercacat berhasil dihapus dari daftar.`} className={'mt-8 fixed z-[7] right-4 top-0 xxs:left-4'} />
                }
                {
                    successCreate === true &&
                    <SuccessAlert msg_primary={'Berhasil dicatat! '} msg_detail={`Barang yang terjual telah dicatat.`} className={'mt-8'} />
                }
                {
                    successEdit === true &&
                    <SuccessAlert msg_primary={'Berhasil diubah! '} msg_detail={`Jumlah pembelian barang telah diubah.`} className={'mt-8 fixed z-[7] right-4 top-0 xxs:left-4'} />
                }
                {
                    successSaved === true &&
                    <SuccessAlert msg_primary={'Berhasil diarsipkan! '} msg_detail={`Pencatatan barang berhasil disimpan dan diarsipkan.`} className={'mt-8 fixed z-[7] right-4 top-0 xxs:left-4'} />
                }
                {
                    successTransaction === true &&
                    <SuccessAlert msg_primary={'Transaksi berhasil! '} msg_detail={`Pencatatan barang berhasil disimpan untuk ditransaksikan.`} className={'mt-8'} />
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
                <form onSubmit={handleSubmit} action='post' ref={formNoteRef} id='form_note' name="form_note" className="mt-6 space-y-6 shadow-md px-4 py-8 rounded-[5px]">
                    <div className="form-group xxs:flex gap-6 items-start xxs:items-stretch xxs:flex-col grid grid-cols-2">
                        {/* Button Submit Otomatis */}
                        {/* <button className='focus:outline-none bg-blue-200 text-blue-800 montserrat px-3 py-2 rounded-[5px]' ref={inputSubmitNote} onClick={e => formNoteRef.current.dispatchEvent(
                            new Event("submit")
                        )}>
                            Catat Barang
                        </button> */}
                        <div className='form-control flex-1 flex flex-wrap gap-2 items-center'>
                        {
                            changeInput === false ?
                            <div className="form-control flex-1">
                                <input type="number" name='product_id' id="product_id" ref={inputProduct} onChange={handleOnChange} value={
                                    data?.product_id
                                } className='rounded-[5px] montserrat w-full' placeholder='ID barang' />
                                <InputError message={errors.hasOwnProperty('product_id') === true && errors?.product_id} className={`${errors?.product_id && 'block'} mt-2 w-full`} />
                            </div>
                            :
                            <div className="form-control flex-1">
                                <SelectBox
                                    value={data?.product_id}
                                    onValueChange={(value) => setData({
                                        ...data,
                                        product_id: value
                                    })}
                                    className='rounded-[5px] montserrat w-full'
                                >
                                {
                                    products?.map(e => {
                                        return (
                                            <SelectBoxItem key={e?.id} value={e?.id} text={e?.name} />
                                        )
                                    })
                                }
                                </SelectBox>
                                <InputError message={errors.hasOwnProperty('product_id') === true && errors?.product_id} className={`${errors?.product_id && 'block'} mt-2 w-full`} />
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
                        <div className="form-control flex-1">
                            <input type="number" name='purchase_amount' id="purchase_amount" ref={inputProduct} onChange={handleOnChange} value={
                                data?.purchase_amount
                            } className='rounded-[5px] montserrat w-full' placeholder='Jumlah pembelian' />
                            <InputError message={errors.hasOwnProperty('purchase_amount') === true && errors?.purchase_amount} className={`${errors?.purchase_amount && 'block'} mt-2 w-full`} />
                        </div>
                    </div>
                    <button className={` ${valuesEmpty() && 'opacity-20 pointer-events-none'} ${processing && ' pointer-events-none'} focus:outline-none bg-blue-200 hover:bg-blue-500 text-blue-800 hover:text-white transition-colors duration-200 montserrat px-3 py-2 rounded-[5px] w-full`} ref={inputSubmitNote} disabled={processing}>
                        {
                            processing ? <Spin /> :  'Catat Barang'
                        }
                    </button>
                </form>
                <div className="form-control mt-10 relative z-[6]">
                    <input type="text" name='search-product' id="search-product" className='rounded-[5px] montserrat sm:w-[50%] w-full' placeholder='Cari informasi barang (id, nama)' onChange={handleSearchProductChange} value={searchProduct} />
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
                <div className="all-note-table mt-10 overflow-x-auto h-[37rem] overflow-y-auto">
                    <table className="w-full text-[1.05rem] text-center text-neutral-800">
                        <thead className="text-white uppercase poppins">
                            <tr className="bg-transparent border-x border-t border-b-0 border-orange-600">
                                <th scope="col" colSpan={8} className="px-6 py-6 text-neutral-900 text-[1.25rem]">
                                    Catatan Penjualan
                                </th>
                            </tr>
                            <tr className="bg-orange-600/95 column-name">
                                <th scope="col" className="px-6 py-3">
                                    Nomor
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Kode Penjualan
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Nama Barang
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Harga Jual
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Jumlah Pembelian
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Satuan
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    SubTotal Biaya
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="montserrat">
                        {
                            notes?.length < 1 ?
                            (
                                <tr className="bg-white border-b">
                                    <td colSpan={8} className="px-6 py-6 text-[1.25rem] text-center">
                                         Tidak ada catatan penjualan
                                    </td>
                                </tr>
                            )  
                            : 
                            notes
                            ?.map((ele, i) => {
                                return (
                                    <tr key={i + 1} className="bg-white border-b even:bg-slate-50">
                                        <td data-column='Nomor' className="px-3 py-4">
                                            {i + 1}
                                        </td>
                                        <td data-column='Kode Penjualan' className="px-3 py-4">
                                            {ele?.code_record}
                                        </td>
                                        <td data-column='Nama Barang' className="px-3 py-4">
                                            <Tooltip
                                                className='montserrat'
                                                content={ele?.product?.name}
                                                animate={{
                                                    mount: { scale: 1, y: 0 },
                                                    unmount: { scale: 0, y: 25 },
                                                }}
                                                >
                                                {
                                                    limitString(ele?.product?.name, 10)
                                                }
                                            </Tooltip>
                                        </td>
                                        <td data-column='Harga Jual' className="px-3 py-4">
                                            {formatedCurrency(ele?.product?.sell_price)}
                                        </td>
                                        <td data-column='Jumlah Pembelian' className="px-3 py-4">
                                            <Popover as={'div'} className='flex flex-wrap justify-center items-center gap-2'>
                                                {({ open, close }) => (
                                                <>
                                                {
                                                    !open &&
                                                    <>
                                                        <h1>
                                                        {
                                                            progressEdit === true ? <Spin /> : ele?.purchase_amount
                                                        }
                                                        </h1>
                                                        <Popover.Button>
                                                            <PencilIcon className="w-4 text-gray-600" />
                                                        </Popover.Button>
                                                    </>
                                                }
                                                    <Transition
                                                        as={'div'}
                                                        enter='ease-out duration-200'
                                                        enterFrom='opacity-0 scale-95'
                                                        enterTo='opacity-100 scale-100'
                                                        leave='ease-in duration-200'
                                                        leaveFrom='opacity-100 scale-100'
                                                        leaveTo='opacity-0 scale-95'
                                                        >
                                                            <Popover.Panel>
                                                                <div className='bg-white shadow-own p-5 relative'>
                                                                    <XMarkIcon className="w-6 h-6 absolute -right-2 -top-1 cursor-pointer bg-red-500 p-1 rounded-full text-white" onClick={ () => close()} />
                                                                    <form onSubmit={(e) => {
                                                                            handleEditPurchaseAmount(e, ele?.id)
                                                                            close()
                                                                        }} className="form-control mt-4">
                                                                        <input type="number" name="purchase_amount" id="purchase_amount" onChange={handleChangeEditNote} className='w-full montserrat focus:outline-0 focus:ring-0' autoFocus={open && true} />
                                                                    </form>
                                                                </div>
                                                            </Popover.Panel>
                                                    </Transition>
                                                </>
                                                )}
                                            </Popover>
                                        </td>
                                        <td data-column='Harga Jual' className="px-3 py-4">
                                            {ele?.product?.unit}
                                        </td>
                                        <td data-column='SubTotal Biaya' className="px-3 py-4">
                                            <form action="put" ref={subTotalRef}>
                                                <input type="hidden" name="cost_subtotal" value={ele?.purchase_amount * ele?.product.sell_price} />
                                                {formatedCurrency(ele?.purchase_amount * ele?.product.sell_price)} 
                                            </form>
                                        </td>
                                        <td data-column='Status' className={"px-3 py-4"}>
                                            {
                                                ele?.is_saved === 'N' ? <h1 className="text-white bg-yellow-500/80
                                                    py-1 px-3 rounded-full">Ditunda</h1> : <h1 className="text-white bg-green-500/80 py-1 px-3 rounded-full">Saved</h1>
                                            } 
                                        </td>
                                        <td data-column='Aksi' className="px-6 py-4">
                                            <div className='flex items-center justify-center gap-1'>
                                            {
                                                ele?.is_saved === 'N' && 
                                                <button onClick={(e) => is_saved(e, ele?.id)}>
                                                    <DocumentArrowUpIcon className="w-5 h-5 text-blue-500" />
                                                </button>
                                            }
                                                <button onClick={(e) => deleteProduct(e, ele?.id)}>
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
                                <td colSpan={5} className='px-2 py-4 border-r border-gray-200 text-[1.25rem] font-semibold'>Total Biaya</td>
                                <td colSpan={3} className='px-2 py-4 border-r border-gray-200 text-blue-800'>
                                    {formatedCurrency(
                                        notes.reduce((acc, note) => {
                                            const sellPrice = note.product?.sell_price;
                                            const amount = note.purchase_amount;
                                            return acc + sellPrice * amount;
                                        }, 0)
                                    )}
                                </td>
                                <td colSpan={1} className='px-2 py-4'>
                                    <form onSubmit={handleSubmitToTransaction} action="put" ref={formTransactionRef}>
                                        <input type="hidden" name="transaction_order" value={valueTransaction?.transaction_order} />
                                        {
                                            notes?.length > 0 &&
                                            <button type="submit" className={`${notes?.map(e => e?.is_saved === 'N' && ' pointer-events-none opacity-50 ')} cursor-pointer`}>
                                                <i className={` las la-save text-[1.55rem] bg-yellow-500 hover:bg-yellow-600/80 text-gray-100 p-2 rounded-full shadow-own`}></i>
                                            </button>
                                        }
                                    </form>
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

Note.layout = page => (
    <AdminLayout title='Catatan Penjualan - Admin Toko Sembako Djuju' keyword='catatan penjualan barang dagangan toko sembako djuju' desc='Halaman untuk megelola catatan penjualan dan transaksi dagangan yang ada pada Toko Sembako Djuju' >
        <DashboardLayout children={page} pageName="Catatan Penjualan" />
    </AdminLayout>
)