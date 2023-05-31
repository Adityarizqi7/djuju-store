import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import { useForm } from '@inertiajs/react';
import { Tooltip } from '@material-tailwind/react';
import { Dialog, Transition } from '@headlessui/react';
import ReactHtmlTableToExcel3 from 'react-html-table-to-excel-3';
import React, { useRef, useState, useCallback, useEffect } from "react";

import '../../../../scss/admin/report/_report.scss';

import { Fragment } from 'react';
import AdminLayout from "@/Layouts/AdminLayout";
import DashboardLayout from '../DashboardLayout';
import { TrashIcon } from '@heroicons/react/24/outline';
import SuccessAlert from '@/Components/alert/SuccessAlert';
import { formatedCurrency, limitString } from "@/Utils/String";
import { convertDateReadble, dateYMD, now } from "@/Utils/Date";

export default function ReportDay({notes}) {

    const inputRef = useRef()
    const ulRef = useRef(null);
    const tableDataRef = useRef();
    const downloadButtonRef = useRef(null);
    
    const { delete: destroy } = useForm()
    
    const [isOpen, setIsOpen] = useState(false)
    const [date, setDate] = useState(dateYMD());
    const [success, setSuccess] = useState(false)
    const [searchNote, setSearchNote] = useState('')
    const [focusInput, setFocusInput] = useState(false)
    const [dialogDownloadFile, setDialogDownloadFile] = useState(false)


    const hitungCostTotal = notes?.filter(e => e?.created_transaction_at?.split(' ')[0] === date)?.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.cost_subtotal;
    }, 0);

    const costTotal = formatedCurrency(hitungCostTotal)

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }
    
    const handleChangeSearchNoteInput = useCallback(
        e => setSearchNote(e.target.value),
        []
    )
    
    const handleTanggalChange = (event) => {
        setDate(event.target.value);
    };
        
    const deleteText = useCallback(() => setSearchNote(''), [])

    const deleteNote = async (e, id) => {
        e.preventDefault()
        destroy(route('report.delete', id), {
            onSuccess: () => {
                setSuccess(true)
            },
            onStart: () => {
                setSuccess(false)
            }
        });
    }

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

    const handleButtonDialogDownload = () => {
        setDialogDownloadFile(!dialogDownloadFile)
    }

    const toPdf = () => {

        const doc = new jsPDF()

        const columnStyles = {
            1: { cellWidth: 20 }, 
            3: { cellWidth: 22 }, 
            4: { cellWidth: 22 }, 
            5: { cellWidth: 15 }, 
            6: { cellWidth: 22 }, 
            7: { cellWidth: 22 }, 
        };

        doc.setFontSize(18)
        var pageSize = doc.internal.pageSize
        var pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth()
        var text = doc.splitTextToSize(`Laporan Catatan Penjualan Pada Toko Sembako Djuju - ${convertDateReadble(date)}`, pageWidth - 30, {})
        var textTwo = doc.splitTextToSize(`Total Omzet: ${costTotal}`, pageWidth - 30, {})
        doc.setLineHeightFactor(1.5)
        doc.text(text, 14, 18)
        doc.text(textTwo, 14, 40)

        autoTable(doc, {
            theme: 'grid',
            startY: 50,
            head: [
                [
                    { content: 'Nomor', styles: { fontWeight: 'bold' } },
                    { content: 'Kode Transaksi', styles: { fontWeight: 'bold' } },
                    { content: 'Nama Barang', styles: { fontWeight: 'bold' } },
                    { content: 'Harga Jual', styles: { fontWeight: 'bold' } },
                    { content: 'Jumlah Pembelian', styles: { fontWeight: 'bold' } },
                    { content: 'Satuan', styles: { fontWeight: 'bold' } },
                    { content: 'Subtotal Biaya', styles: { fontWeight: 'bold' } },
                    { content: 'Total Biaya', styles: { fontWeight: 'bold' } }
                ]
            ],
            body:
                notes
                ?.filter(e => e?.created_transaction_at?.split(' ')[0] === date )
                ?.map((note, id) => [
                    id + 1,
                    note?.transaction_order,
                    note?.product.name,
                    formatedCurrency(note?.product.sell_price),
                    note?.purchase_amount,
                    note?.product?.unit,
                    formatedCurrency(note?.cost_subtotal),
                    formatedCurrency(note?.cost_total)
                ])
            ,
            columnStyles,
            didParseCell: function (data) {
                data.cell.styles.halign = 'center';
                data.cell.styles.valign = 'middle';
            }
        })

        return doc.save(`Laporan Penjualan - ${convertDateReadble(date)}`)
    }
      
    const totalTransactions = notes
    .filter(value => {
        if (date) {
        if (value?.created_transaction_at?.slice(0, 10) === date) return true;
        return false;
        }
        return true;
    })
    .reduce((count, note) => {
        if (!count.codeRecords.includes(note.transaction_order)) {
        count.codeRecords.push(note.transaction_order);
        count.totalTransactions++;
        }
        return count;
    }, { codeRecords: [], totalTransactions: 0 }).totalTransactions;
      
    useEffect(() => {
        document.addEventListener('keydown', handleFocusInput)

        function handleClickOutside(event) {
            if (
              ulRef.current && !ulRef.current.contains(event.target) &&
              downloadButtonRef.current && !downloadButtonRef.current.contains(event.target)
            ) {
              setDialogDownloadFile(false);
            }
        }
      
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('keydown', handleFocusInput)
            document.removeEventListener('click', handleClickOutside, true);
        }
    }, [handleFocusInput])

    return (
        <div className="report-component">
            <div id="container_report">
                <div className="statistic-search-section mt-8 font-medium">
                    <div className='search-note montserrat xs:w-full xs:order-2 w-[45%] xs:ml-0 ml-auto'>
                        <div className='box-search inter w-full'>
                            <input
                                type='text'
                                name='search-movie'
                                autoComplete='off'
                                className={`bg-transparent pr-[3rem] focus:outline-none focus:ring-0 pl-0`}
                                placeholder='Cari catatan penjualan ...'
                                onChange={handleChangeSearchNoteInput}
                                ref={inputRef}
                                value={searchNote}
                            />
                            {searchNote !== '' && (
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
                                        searchNote !== '' ? 'hidden' : 'block'
                                    } inter absolute top-[1.15rem] right-0 text-[14px] font-semibold text-gray-400`}
                                >
                                    Ctrl K
                                </h1>
                            }
                        </div>
                    </div>
                </div>
                {
                    success === true &&
                    <SuccessAlert msg_primary={'Berhasil dihapus! '} msg_detail={`Barang telah dihapus dari laporan penjualan.`} className={'mt-8 fixed right-4 top-0 xxs:left-4'} />
                }
                <div className="date-download-section flex 3xs:flex-col gap-5 items-center justify-between mt-10">
                    <div className='flex 3xs:flex-col w-full gap-3'>
                        <button ref={downloadButtonRef} onClick={handleButtonDialogDownload} className={`${dialogDownloadFile === true ? 'border-blue-600 text-blue-800 ' : 'text-neutral-800 border-neutral-600'} focus:ring-0 flex flex-wrap gap-1 items-center justify-center text-[1.1rem] rounded-[5px] montserrat p-2 border hover:text-blue-800 hover:border-blue-600 3xs:self-start 3xs:w-full`}>
                            <i className="las la-file-download text-[1.55rem]"></i>
                            <h1>Download File</h1>
                        </button>
                        <button
                        type="button"
                        onClick={openModal}
                        className="rounded-[10px] bg-blue-200 px-4 3xs:py-3 py-1 montserrat text-blue-700 font-medium"
                        >
                            Lihat Statistik
                        </button>
                    </div>
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
                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h1"
                                        className="text-lg font-semibold leading-6 text-gray-900"
                                    >
                                        Statistik Penjualan {convertDateReadble(date)}
                                    </Dialog.Title>
                                    <div className="mt-3 space-y-2 border-b border-gray-400/40 pb-2">
                                        <h1>Total Omset: <strong> {
                                            costTotal
                                        }</strong>
                                        </h1>
                                        <h1>Total Transaksi: <strong> {
                                            totalTransactions
                                        }</strong>
                                        </h1>
                                    </div>
                                    <div className="mt-3">
                                        <h1 className='font-medium'>Total Barang Terjual :</h1>
                                        <div className='space-y-2'>
                                            <h2 className='mt-2'>
                                            <strong>
                                            {
                                                notes
                                                ?.filter(e => e?.created_transaction_at?.split(' ')[0] === date)
                                                ?.filter(e => e?.product?.unit === "pcs")
                                                .map(e => {
                                                    return e?.purchase_amount;
                                                })
                                                .reduce((accumulator, currentValue) => {
                                                    return accumulator + currentValue;
                                                }, 0)
                                            } 
                                            </strong>
                                            {' '} barang terjual dengan satuan <i>'piece'</i>
                                            </h2>

                                            <h2 className='mt-2'>
                                            <strong>
                                            {
                                                notes
                                                ?.filter(e => e?.created_transaction_at?.split(' ')[0] === date)
                                                ?.filter(e => e?.product?.unit === "kg")
                                                .map(e => {
                                                    return e?.purchase_amount;
                                                })
                                                .reduce((accumulator, currentValue) => {
                                                    return accumulator + currentValue;
                                                }, 0)
                                            } 
                                            </strong>
                                            {' '} barang terjual dengan satuan <i>'kilogram'</i>
                                            </h2>

                                            <h2 className='mt-2'>
                                            <strong>
                                            {
                                                notes
                                                ?.filter(e => e?.created_transaction_at?.split(' ')[0] === date)
                                                ?.filter(e => e?.product?.unit === "kardus")
                                                .map(e => {
                                                    return e?.purchase_amount;
                                                })
                                                .reduce((accumulator, currentValue) => {
                                                    return accumulator + currentValue;
                                                }, 0)
                                            } 
                                            </strong>
                                            {' '} barang terjual dengan satuan <i>'kardus'</i>
                                            </h2>
                                        </div>
                                    </div>

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
                    <input type="date" id="date" name='datekey' value={date} onChange={handleTanggalChange} className='montserrat rounded-[5px] 3xs:w-full bg-blue-600 border-0 text-white' />
                </div>
                {
                    dialogDownloadFile &&
                    <ul className='rounded-[5px] shadow-own flex flex-col w-[11rem] mt-4' ref={ulRef}>
                        <li className='hover:bg-gray-200/50'>
                            <button onClick={toPdf} type='button' className='w-full transition-colors duration-200 text-red-500 px-2 py-4 text-[1rem] montserrat flex items-center gap-1 font-semibold'>
                                <i className="las la-file-pdf text-[1.55rem]"></i>
                                <span>PDF</span>
                            </button>
                        </li>
                        <li className='hover:bg-gray-200/50'>
                         <button type='button' className='w-full transition-colors duration-200 text-green-600 px-2 py-4 text-[1rem] montserrat flex items-center gap-1 font-semibold'>
                                <i className="las la-file-pdf text-[1.55rem]"></i>
                                <ReactHtmlTableToExcel3 
                                    id="convert-xls-button"
                                    className="download-table-xls-button"
                                    table="table-data"
                                    filename={`Laporan Penjualan Pada Toko Sembako Djuju - ${convertDateReadble(date)}`}
                                    filetype="xls"
                                    sheet="tablexls"
                                    buttonText="Excel"
                                />
                            </button>
                        </li>
                    </ul>
                }
                <div className="all-note-table mt-6 overflow-x-auto h-[37rem] overflow-y-auto">
                    <table id='table-data' className="w-full text-[1.05rem] text-center text-neutral-800" ref={tableDataRef}>
                        <thead className="text-white uppercase poppins">
                            <tr className="bg-transparent border-x border-t border-b-0 border-orange-600">
                                <th scope="col" colSpan={8} className="px-6 py-6 text-neutral-900 text-[1.25rem]">
                                    Penjualan Barang - {convertDateReadble(date)}
                                </th>
                            </tr>
                            <tr className="bg-orange-600/95 column-name">
                                <th scope="col" className="px-6 py-3">
                                    Nomor
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Kode Transaksi
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
                                    Total Biaya
                                </th>
                                {/* <th scope="col" className="px-6 py-3">
                                    Aksi
                                </th> */}
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
                            ?.filter(value => {
                                if (date) {
                                    if (value?.created_transaction_at?.slice(0, 10) === date) return true;
                                    return false;
                                }
                                return true;
                            }).filter(value => {
                                if (
                                    (value?.product?.name?.toLowerCase().includes(searchNote?.toLowerCase().trim()) ||
                                    String(value?.product?.sell_price)?.toLowerCase().includes(searchNote?.toLowerCase().trim()))
                                ) {
                                    return true;
                                } else {
                                    return false;
                                }
                            })
                            ?.map((ele, i) => {
                                return (
                                    <tr key={i + 1} className="bg-white border-b even:bg-slate-50">
                                        <td data-column='Nomor' className="px-3 py-4">
                                            {i + 1}
                                        </td>
                                        <td data-column='Kode Penjualan' className="px-3 py-4">
                                            {ele?.transaction_order.substring(5)}
                                        </td>
                                        <td data-column='Nama Barang' className="px-3 py-4" id='product_name'>
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
                                            {ele?.purchase_amount}
                                        </td>
                                        <td data-column='Satuan' className="px-3 py-4">
                                            {ele?.product?.unit}
                                        </td>
                                        <td data-column='SubTotal Biaya' className="px-3 py-4">
                                            {formatedCurrency(ele?.cost_subtotal)} 
                                        </td>
                                        <td data-column='SubTotal Biaya' className="px-3 py-4">
                                            {formatedCurrency(ele?.cost_total)} 
                                        </td>
                                        {/* <td className="px-6 py-4">
                                            <button onClick={(e) => deleteNote(e, ele?.id)}>
                                                <TrashIcon className="w-5 h-5 text-red-500" />
                                            </button>
                                        </td> */}
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                    {/* <Pagination className='mt-6' links={notes?.links}/> */}
                </div>
            </div>
        </div>
    )
}

ReportDay.layout = page => (
    <AdminLayout title='Laporan Harian - Admin Toko Sembako Djuju' keyword='laporan harian catatan penjualan barang dagangan toko sembako djuju' desc='Halaman untuk megelola laporan harian dagangan yang ada pada Toko Sembako Djuju' >
        <DashboardLayout children={page} pageName="Laporan Penjualan Harian" />
    </AdminLayout>
)