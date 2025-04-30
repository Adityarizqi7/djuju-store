import { useForm, Link } from "@inertiajs/react";
import React, { useEffect, useRef, useState, useCallback } from "react";

import '../../../../scss/admin/profit/_showprofit.scss';

import { oneMonthBefore } from '@/Utils/Date';
import AdminLayout from "@/Layouts/AdminLayout";
import DashboardLayout from '../DashboardLayout';
import InputError from "@/Components/InputError";
import { Spin } from "@/Components/loading/Spin";
import InputLabel from "@/Components/InputLabel";
import SuccessAlert from "@/Components/alert/SuccessAlert";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function ShowProfit({profit}) {

    const inputRef = useRef()
    const formProfitRef = useRef()
    const inputProduct = useRef()
    const inputSubmitNote = useRef()
    
    const [searchNote, setSearchNote] = useState('')
    const [focusInput, setFocusInput] = useState(false)
    const [searchProduct, setSearchProduct] = useState('')

    const [successEdit, setSuccessEdit] = useState(false)
    
    const { data, setData, put, errors, processing } = useForm({
        profit_amount: profit?.profit_amount,
        profit_time: profit?.profit_time,
    })

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
        const { name, value } = e.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
        // handleSubmit(e)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('profit.update', profit?.id), {
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
    }, [handleFocusInput])

    return (
        <div className="show-profit-component">
            <div id="container_show_profit">
                <Link href={route('profit.dashboard')} className='back-section mt-8 flex items-center gap-x-2'>
                    <ArrowLeftIcon className='w-6 h-6' />
                    <h3 className="montserrat font-medium">Daftar Profit</h3>
                </Link>
                {
                    successEdit === true &&
                    <SuccessAlert msg_primary={'Berhasil diubah! '} msg_detail={`Data Profit telah diubah.`} className={'mt-8 fixed z-[7] right-4 top-0 xxs:left-4'} />
                }
                <form onSubmit={handleSubmit} action='post' ref={formProfitRef} id='form_profit' name="form_profit" className="mt-10 space-y-6">
                    <div className="form-group xxs:flex gap-6 xxs:items-stretch xxs:flex-col grid grid-cols-2">
                        <div className='form-control flex-1'>
                            <InputLabel classStar='hidden' htmlFor="product_id" value="Nominal Profit" className='text-[1.15rem] mb-3' />
                            <input type="number" name='profit_amount' id="profit_amount" onChange={handleOnChange} value={
                                data?.profit_amount
                            } className='rounded-[5px] montserrat w-full' placeholder='Nominal Profit' />
                            <InputError message={
                                errors.hasOwnProperty('profit_amount') === true &&
                                errors?.profit_amount
                            } className={`${errors?.profit_amount && 'block'} mt-2 xxs:w-full`} />
                        </div>
                        <div className='form-control flex-1'>
                            <InputLabel classStar='hidden' htmlFor="month" value="Bulan Modal" className='text-[1.15rem] mb-3' />
                            <input type="month" id="month" name='profit_time' value={data?.profit_time} onChange={handleOnChange} className='montserrat rounded-[5px] w-full bg-blue-600 border-0 text-white' max={oneMonthBefore()} />
                            <InputError message={
                                errors.hasOwnProperty('profit_time') === true &&
                                errors?.profit_time
                            } className={`${errors?.profit_time && 'block'} mt-2 w-[30rem] xxs:w-full`} />
                        </div>
                    </div>
                    <button className={` ${processing && ' pointer-events-none'} focus:outline-none bg-blue-200 hover:bg-blue-500 text-blue-800 hover:text-white transition-colors duration-200 montserrat px-3 py-2 rounded-[5px] w-full`} ref={inputSubmitNote} disabled={processing}>
                        {
                            processing ? <Spin /> :  'Simpan Modal'
                        }
                    </button>
                </form>
            </div>
        </div>
    )
}

ShowProfit.layout = page => (
    <AdminLayout title='Ubah Profit - Admin JujuMart' keyword='ubah profit dagangan JujuMart' desc='Halaman untuk mengelola profit dagangan yang ada pada JujuMart' >
        <DashboardLayout children={page} pageName="Ubah Omzet" />
    </AdminLayout>
)