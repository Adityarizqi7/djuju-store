import { useForm, Link } from "@inertiajs/react";
import React, { useEffect, useRef, useState, useCallback } from "react";

import '../../../../scss/admin/profit/_profit.scss';

import AdminLayout from "@/Layouts/AdminLayout";
import DashboardLayout from '../DashboardLayout';
import InputError from "@/Components/InputError";
import { Spin } from "@/Components/loading/Spin";
import { formatedCurrency } from "@/Utils/String"
import SuccessAlert from "@/Components/alert/SuccessAlert";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { now, monthYM, convertMonthReadble, yearY, oneMonthBefore } from '@/Utils/Date';

export default function Profit({modal, omzet, totalProfit_lastMonth}) {

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
        profit_amount: '',
        profit_time: oneMonthBefore(),
    })

    const deleteProfit = (e, id) => {
        e?.preventDefault()
        destroy(route('profit.delete', id), {
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
        post(route('profit.store'), {
            onSuccess() {
                setSuccessCreate(true)
                setData({
                    profit_amount: '',
                    profit_time: oneMonthBefore()
                })
            },
            onStart() {
                setSuccessCreate(false)
            }
        })
    };

    const omzetFiltered = omzet
    ?.filter((value) => {
        if (year) {
        if (value?.omzet_time?.slice(0, 4) === year) return true;
        return false;
        }
        return true;
    });

    const totalProfitByAssetTime = modal.reduce((accumulator, currentValue) => {
        const assetTime = currentValue?.asset_time;
        if (omzetFiltered?.some((omz) => omz.omzet_time === assetTime)) {
          accumulator[assetTime] = (accumulator[assetTime] || 0) + currentValue.cost_total;
        }
        return accumulator;
    }, {});
    
    const totalModal = modal
    ?.filter((value) => {
        if (year) {
            if (value?.asset_time?.slice(0, 4) === year) return true;
            return false;
        }
        return true;
    })
    ?.filter((value) => {
        // filter modal berdasarkan asset_time yang sama dengan omzet
        return omzet?.some((omz) => omz.omzet_time === value.asset_time);
    })
    ?.reduce((total, value) => {
        return total + value.cost_total;
    }, 0)

    const totalOmzet = omzet
    ?.filter((value) => {
        if (year) {
            return value?.omzet_time?.slice(0, 4) === year;
        }
        return true;
    })
    ?.reduce((total, value) => {
        return total + value?.omzet_amount;
    }, 0)

    useEffect(() => {

        document.addEventListener('keydown', handleFocusInput)

        return () => {
            document.removeEventListener('keydown', handleFocusInput)
        }
    }, [handleFocusInput])

    return (
        <div className="profit-component">
            <div id="container_profit">
                <div className="scan-section mt-8 font-medium flex flex-wrap gap-3 justify-between items-center">
                    <div className="profit-current-month montserrat">
                        <h2>
                        {
                            `Total Profit bulan ${convertMonthReadble(oneMonthBefore())} : `
                        }
                            <span className='text-orange-600'>
                            {
                                `${formatedCurrency(totalProfit_lastMonth)}`
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
                    <SuccessAlert msg_primary={'Berhasil dihapus! '} msg_detail={`Profit yang telah tercacat berhasil dihapus dari daftar.`} className={'mt-8 fixed z-[7] right-4 top-0 xxs:left-4'} />
                }
                {
                    successCreate === true &&
                    <SuccessAlert msg_primary={'Berhasil dicatat! '} msg_detail={` Profit telah dicatat.`} className={'mt-8'} />
                }
                {/* <div className="mt-6 alert flex items-center 3xs:block bg-blue-500 montserrat py-3 px-3 rounded-[10px] gap-2 text-white">
                    <i className="las la-exclamation-circle text-[1.5rem]"></i>
                    <h1>Profit bulan ini dapat diunggah ketika bulan <u>{convertMonthReadble(monthYM())}</u> selesai. Lihat Statistik Profit <Link href={route('report.period.month')} className='underline'>disini</Link></h1>
                </div>
                
                    formShow &&
                    <form onSubmit={handleSubmitCurrentMonth} action='post' ref={formNoteRef} id='form_note' name="form_note" className="mt-6 space-y-6 shadow-md px-4 py-8 rounded-[5px]">
                        <div className="readble-profit_amount montserrat font-semibold">
                            {
                                data?.profit_amount === '' ?
                                <h2>
                                    {formatedCurrency(0)}
                                </h2>
                                :
                                <h2>
                                    {formatedCurrency(parseInt(data?.profit_amount))}
                                </h2>
                            }
                        </div>
                        <div className="form-group xxs:flex gap-6 xxs:items-stretch xxs:flex-col grid grid-cols-2">
                            <div className={`form-control flex-1`}>
                                <input type="number" name='profit_amount' id="profit_amount" onChange={handleOnChangeCurrentMonth} value={
                                    data?.profit_amount
                                } className='rounded-[5px] montserrat w-full' placeholder='Nominal Profit' />
                                <InputError message={
                                    errors.hasOwnProperty('profit_amount') === true &&
                                    errors?.profit_amount
                                } className={`${errors?.profit_amount && 'block'} mt-2 xxs:w-full`} />
                            </div>
                            <div className='form-control flex-1'>
                                <input type="month" id="month" name='profit_time' value={data?.profit_time} onChange={handleOnChangeCurrentMonth} className='montserrat rounded-[5px] w-full bg-blue-600 border-0 text-white'  max={oneMonthBefore()} />
                                <InputError message={
                                    errors.hasOwnProperty('profit_time') === true &&
                                    errors?.profit_time
                                } className={`${errors?.profit_time && 'block'} mt-2 w-[30rem] xxs:w-full`} />
                            </div>
                        </div>
                        <button className={` ${processing && ' pointer-events-none'} focus:outline-none bg-blue-200 hover:bg-blue-500 text-blue-800 hover:text-white transition-colors duration-200 montserrat px-3 py-2 rounded-[5px] w-full`} ref={inputSubmitNote} disabled={processing}>
                            {
                                processing ? <Spin /> :  'Simpan Profit'
                            }
                        </button>
                    </form> */}
                
                <div className="form-control mt-10 flex xxs:flex-col items-center justify-between gap-5">
                    <Link
                        href={route('profit.predict')}
                        className="rounded-[5px] bg-orange-200 hover:bg-orange-300 px-4 py-3 transition-colors montserrat text-orange-700 font-medium"
                    >
                        <h3>Prediksi Profit</h3>
                    </Link>
                    <input type="number" id="date" name='datekey' value={year} onChange={handleYearChange} className='montserrat rounded-[5px] w-[25%] xxs:w-full bg-orange-500/95 border-0 text-white placeholder:text-white' placeholder="Masukkan Tahun" />
                </div>
                <div className="all-profit-table mt-10 overflow-x-auto h-[37rem] overflow-y-auto">
                    <table className="w-full text-[1.05rem] text-center text-neutral-800">
                        <thead className="text-white uppercase poppins">
                            <tr className="bg-transparent border-x border-t border-b-0 border-orange-600">
                                <th scope="col" colSpan={5} className="px-6 py-6 text-neutral-900 text-[1.25rem]">
                                    Profit Bulanan Pada Tahun {year}
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
                                    Nominal Modal
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Nominal Profit
                                </th>
                                {/* <th scope="col" className="px-6 py-3">
                                    Aksi
                                </th> */}
                            </tr>
                        </thead>
                        <tbody className="montserrat">
                        {
                            omzet?.length < 1 ?
                            (
                                <tr className="bg-white border-b">
                                    <td colSpan={4} className="px-6 py-6 text-[1.25rem] text-center">
                                         Tidak ada profit pada tahun {year}
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
                                const modalItem = totalProfitByAssetTime[ele.omzet_time] || 0;
                                const totalProfit = modal
                                    ?.filter((value) => value?.asset_time === ele?.omzet_time)
                                    ?.reduce((accumulator, currentValue) => accumulator + (currentValue?.cost_total || 0), 0);
                                return (
                                    <tr key={i + 1} className="bg-white border-b even:bg-slate-50">
                                        <td data-column='Nomor' className="px-3 py-4">
                                            {i + 1}
                                        </td>
                                        <td data-column='Bulan Profit' className="px-3 py-4">
                                            {convertMonthReadble(ele?.omzet_time)}
                                        </td>
                                        <td data-column='Nominal Omset' className="px-3 py-4">
                                        {
                                            formatedCurrency(ele?.omzet_amount)
                                        }
                                        </td>
                                        <td data-column='Nominal Modal' className="px-3 py-4">
                                        {
                                            formatedCurrency(modalItem)
                                        }
                                        </td>
                                        <td data-column='Nominal Profit' className="px-3 py-4">
                                        {
                                            formatedCurrency(ele?.omzet_amount - totalProfit)
                                        }
                                        </td>
                                        {/* <td data-column='Aksi' className="px-6 py-4 flex justify-center items-center space-x-2">
                                            <Link href={route('profit.edit', ele?.id)}>
                                                <PencilSquareIcon className="w-6 h-6 text-blue-600" />
                                            </Link>
                                            <button onClick={(el) => deleteProfit(el, ele?.id)}>
                                                <TrashIcon className="w-5 h-5 text-red-500" />
                                            </button>
                                        </td> */}
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                        <tfoot>
                            <tr className='montserrat border-b bg-gray-100'>
                                <td colSpan={3} className='px-2 py-4 border-r border-gray-200 text-[1.25rem] font-semibold'>Total Profit</td>
                                <td colSpan={2} className='px-2 py-4 border-r border-gray-200 text-blue-800'>
                                {
                                    formatedCurrency(
                                        totalOmzet - totalModal
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

Profit.layout = page => (
    <AdminLayout title='Profit - Admin Toko Sembako Djuju' keyword='profit dagangan toko sembako djuju' desc='Halaman untuk mengelola profit dagangan yang ada pada Toko Sembako Djuju' >
        <DashboardLayout children={page} pageName="Profit" />
    </AdminLayout>
)