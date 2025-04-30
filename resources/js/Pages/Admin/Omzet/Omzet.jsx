import { useForm, Link } from "@inertiajs/react";
import React, { useEffect, useRef, useState, useCallback } from "react";

import '../../../../scss/admin/omzet/_omzet.scss';

import AdminLayout from "@/Layouts/AdminLayout";
import DashboardLayout from '../DashboardLayout';
import InputError from "@/Components/InputError";
import { Spin } from "@/Components/loading/Spin";
import { formatedCurrency } from "@/Utils/String"
import SuccessAlert from "@/Components/alert/SuccessAlert";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { now, monthYM, convertMonthReadble, yearY, oneMonthBefore } from '@/Utils/Date';

export default function Omzet({modal, omzet, totalCostSubtotal_lastMonth}) {

    const inputRef = useRef()
    const formNoteRef = useRef()
    const inputSubmitNote = useRef()
    
    const [year, setYear] = useState(yearY())
    const [formShow, setFormShow] = useState(true)
    const [searchNote, setSearchNote] = useState('')
    const [focusInput, setFocusInput] = useState(false)

    const [successCreate, setSuccessCreate] = useState(false)
    const [successDelete, setSuccessDelete] = useState(false)
    
    const { data, setData, post, errors, delete: destroy, processing } = useForm({
        omzet_amount: '',
        omzet_time: oneMonthBefore(),
    })

    const deleteOmzet = (e, id) => {
        e?.preventDefault()
        destroy(route('omzet.delete', id), {
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

    const handleOnChangeCurrentMonth = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
        // handleSubmitCurrentMonth(e)
    };

    const handleYearChange = (event) => {
        setYear(event.target.value);
    };

    const handleSubmitCurrentMonth = (e) => {
        e.preventDefault();
        post(route('omzet.store'), {
            onSuccess() {
                setSuccessCreate(true)
                setData({
                    omzet_amount: '',
                    omzet_time: oneMonthBefore()
                })
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
    }, [handleFocusInput])

    return (
        <div className="omzet-component">
            <div id="container_omzet">
                <div className="scan-section mt-8 font-medium flex flex-wrap gap-3 justify-between items-center">
                    <div className="omzet-current-month montserrat">
                        <h2>
                        {
                            `Total Omzet bulan ${convertMonthReadble(oneMonthBefore())} : `
                        }
                            <span className='text-orange-600'>
                            {
                                `${formatedCurrency(totalCostSubtotal_lastMonth)}`
                            }
                            </span>
                        </h2>
                    </div>
                    <div className="scan-qrcode ml-auto static flex items-center gap-2">
                        <i onClick={() => setFormShow(!formShow)} className={`${formShow === true && 'rotate-45' } las la-plus text-[2.25rem] cursor-pointer`}></i>
                    </div>
                </div>

                {
                    successDelete === true &&
                    <SuccessAlert msg_primary={'Berhasil dihapus! '} msg_detail={`Omzet yang telah tercacat berhasil dihapus dari daftar.`} className={'mt-8 fixed z-[7] right-4 top-0 xxs:left-4'} />
                }
                {
                    successCreate === true &&
                    <SuccessAlert msg_primary={'Berhasil dicatat! '} msg_detail={` Omzet telah dicatat.`} className={'mt-8'} />
                }
                <div className="mt-6 alert flex items-center 3xs:block bg-blue-500 montserrat py-3 px-3 rounded-[10px] gap-2 text-white">
                    <i className="las la-exclamation-circle text-[1.5rem]"></i>
                    <h1>Omzet bulan ini dapat diunggah ketika bulan <u>{convertMonthReadble(monthYM())}</u> selesai. Lihat Statistik Omzet <Link href={route('report.period.month')} className='underline'>disini</Link></h1>
                </div>
                {
                    formShow &&
                    <form onSubmit={handleSubmitCurrentMonth} action='post' ref={formNoteRef} id='form_note' name="form_note" className="mt-6 space-y-6 shadow-md px-4 py-8 rounded-[5px]">
                        {/* Form Current Month */}
                        <div className="readble-omzet_amount montserrat font-semibold">
                            {
                                data?.omzet_amount === '' ?
                                <h2>
                                    {formatedCurrency(0)}
                                </h2>
                                :
                                <h2>
                                    {formatedCurrency(parseInt(data?.omzet_amount))}
                                </h2>
                            }
                        </div>
                        <div className="form-group xxs:flex gap-6 xxs:items-stretch xxs:flex-col grid grid-cols-2">
                            <div className={`form-control flex-1`}>
                                <input type="number" name='omzet_amount' id="omzet_amount" onChange={handleOnChangeCurrentMonth} value={
                                    data?.omzet_amount
                                } className='rounded-[5px] montserrat w-full' placeholder='Nominal Omzet' />
                                <InputError message={
                                    errors.hasOwnProperty('omzet_amount') === true &&
                                    errors?.omzet_amount
                                } className={`${errors?.omzet_amount && 'block'} mt-2 xxs:w-full`} />
                            </div>
                            <div className='form-control flex-1'>
                                <input type="month" id="month" name='omzet_time' value={data?.omzet_time} onChange={handleOnChangeCurrentMonth} className='montserrat rounded-[5px] w-full bg-blue-600 border-0 text-white' max={oneMonthBefore()} />
                                <InputError message={
                                    errors.hasOwnProperty('omzet_time') === true &&
                                    errors?.omzet_time
                                } className={`${errors?.omzet_time && 'block'} mt-2 w-[30rem] xxs:w-full`} />
                            </div>
                        </div>
                        <button className={` ${processing && ' pointer-events-none'} focus:outline-none bg-blue-200 hover:bg-blue-500 text-blue-800 hover:text-white transition-colors duration-200 montserrat px-3 py-2 rounded-[5px] w-full`} ref={inputSubmitNote} disabled={processing}>
                            {
                                processing ? <Spin /> :  'Simpan Omzet'
                            }
                        </button>
                    </form>
                }
                <div className="form-control mt-10 flex xxs:flex-col items-center justify-between gap-5">
                    <Link
                        href={route('omzet.predict')}
                        className="rounded-[5px] bg-orange-200 hover:bg-orange-300 px-4 py-3 transition-colors montserrat text-orange-700 font-medium"
                    >
                        <h3>Prediksi Omzet</h3>
                    </Link>
                    <input type="number" id="date" name='datekey' value={year} onChange={handleYearChange} className='montserrat rounded-[5px] w-[25%] xxs:w-full bg-orange-500/95 border-0 text-white placeholder:text-white' placeholder="Masukkan Tahun" />
                </div>
                <div className="all-omzet-table mt-10 overflow-x-auto h-[37rem] overflow-y-auto">
                    <table className="w-full text-[1.05rem] text-center text-neutral-800">
                        <thead className="text-white uppercase poppins">
                            <tr className="bg-transparent border-x border-t border-b-0 border-orange-600">
                                <th scope="col" colSpan={5} className="px-6 py-6 text-neutral-900 text-[1.25rem]">
                                    Omzet Bulanan Pada Tahun {year}
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
                                    Nominal Omzet
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Nominal Profit
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="montserrat">
                        {
                            omzet?.length < 1 ?
                            (
                                <tr className="bg-white border-b">
                                    <td colSpan={5} className="px-6 py-6 text-[1.25rem] text-center">
                                         Tidak ada omzet pada tahun {year}
                                    </td>
                                </tr>
                            )  
                            : 
                            omzet
                            ?.filter((value) => {
                                if (year) {
                                    if (value?.omzet_time?.slice(0, 4) === year) return true;
                                    return false;
                                }
                                return true;
                            })
                            ?.map((ele, i) => {
                                const totalProfit = modal
                                    ?.filter((value) => value?.asset_time === ele?.omzet_time)
                                    ?.reduce((accumulator, currentValue) => accumulator + (currentValue?.cost_total || 0), 0);
                                return (
                                    <tr key={i + 1} className="bg-white border-b even:bg-slate-50">
                                        <td data-column='Nomor' className="px-3 py-4">
                                            {i + 1}
                                        </td>
                                        <td data-column='Bulan Omzet' className="px-3 py-4">
                                            {convertMonthReadble(ele?.omzet_time)}
                                        </td>
                                        <td data-column='Nominal Omset' className="px-3 py-4">
                                        {
                                            formatedCurrency(ele?.omzet_amount)
                                        }
                                        </td>
                                        <td data-column='Nominal Profit' className="px-3 py-4">
                                        {
                                            formatedCurrency(ele?.omzet_amount - totalProfit)
                                        }
                                        </td>
                                        <td data-column='Aksi' className="px-6 py-4 flex justify-center items-center space-x-2">
                                            <Link href={route('omzet.edit', ele?.id)}>
                                                <PencilSquareIcon className="w-6 h-6 text-blue-600" />
                                            </Link>
                                            <button onClick={(el) => deleteOmzet(el, ele?.id)}>
                                                <TrashIcon className="w-5 h-5 text-red-500" />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                        <tfoot>
                            <tr className='montserrat border-b bg-gray-100'>
                                <td colSpan={3} className='px-2 py-4 border-r border-gray-200 text-[1.25rem] font-semibold'>Total Omzet</td>
                                <td colSpan={2} className='px-2 py-4 border-r border-gray-200 text-blue-800'>
                                {
                                    formatedCurrency(
                                        omzet?.filter((value) => {
                                        if (year) {
                                            if (value?.omzet_time?.slice(0, 4) === year) return true;
                                            return false;
                                        }
                                        return true;
                                    })?.reduce((total, omzet) => total + omzet?.omzet_amount, 0)
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

Omzet.layout = page => (
    <AdminLayout title='Omzet - Admin JujuMart' keyword='omzet dagangan JujuMart' desc='Halaman untuk mengelola omzet dagangan yang ada pada JujuMart' >
        <DashboardLayout children={page} pageName="Omzet" />
    </AdminLayout>
)