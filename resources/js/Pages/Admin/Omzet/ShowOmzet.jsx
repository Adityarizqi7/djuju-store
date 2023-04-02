import { useForm, router, Link } from "@inertiajs/react";
import React, { useEffect, useRef, useState, useCallback } from "react";

import '../../../../scss/admin/omzet/_showomzet.scss';

import { now, monthYM, oneMonthBefore } from '@/Utils/Date';
import TextInput from "@/Components/TextInput";
import AdminLayout from "@/Layouts/AdminLayout";
import DashboardLayout from '../DashboardLayout';
import InputError from "@/Components/InputError";
import { Spin } from "@/Components/loading/Spin";
import InputLabel from "@/Components/InputLabel";
import SuccessAlert from "@/Components/alert/SuccessAlert";
import { ArrowLeftIcon, QrCodeIcon } from "@heroicons/react/24/outline";

export default function ShowOmzet({omzet}) {

    const inputRef = useRef()
    const formOmzetRef = useRef()
    const inputProduct = useRef()
    const inputSubmitNote = useRef()
    
    const [searchNote, setSearchNote] = useState('')
    const [focusInput, setFocusInput] = useState(false)
    const [searchProduct, setSearchProduct] = useState('')

    const [successEdit, setSuccessEdit] = useState(false)
    
    const { data, setData, put, errors, processing } = useForm({
        omzet_amount: omzet?.omzet_amount,
        omzet_time: omzet?.omzet_time,
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
        put(route('omzet.update', omzet?.id), {
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
        <div className="show-omzet-component">
            <div id="container_show_omzet">
                <Link href={route('omzet.dashboard')} className='back-section mt-8 flex items-center gap-x-2'>
                    <ArrowLeftIcon className='w-6 h-6' />
                    <h3 className="montserrat font-medium">Daftar Omzet</h3>
                </Link>
                {
                    successEdit === true &&
                    <SuccessAlert msg_primary={'Berhasil diubah! '} msg_detail={`Data Omzet telah diubah.`} className={'mt-8 fixed z-[7] right-4 top-0 xxs:left-4'} />
                }
                <form onSubmit={handleSubmit} action='post' ref={formOmzetRef} id='form_omzet' name="form_omzet" className="mt-10 space-y-6">
                    <div className="form-group xxs:flex gap-6 xxs:items-stretch xxs:flex-col grid grid-cols-2">
                        <div className='form-control flex-1'>
                            <InputLabel classStar='hidden' htmlFor="product_id" value="Nominal Omzet" className='text-[1.15rem] mb-3' />
                            <input type="number" name='omzet_amount' id="omzet_amount" onChange={handleOnChange} value={
                                data?.omzet_amount
                            } className='rounded-[5px] montserrat w-full' placeholder='Nominal Omzet' />
                            <InputError message={
                                errors.hasOwnProperty('omzet_amount') === true &&
                                errors?.omzet_amount
                            } className={`${errors?.omzet_amount && 'block'} mt-2 xxs:w-full`} />
                        </div>
                        <div className='form-control flex-1'>
                            <InputLabel classStar='hidden' htmlFor="month" value="Bulan Modal" className='text-[1.15rem] mb-3' />
                            <input type="month" id="month" name='omzet_time' value={data?.omzet_time} onChange={handleOnChange} className='montserrat rounded-[5px] w-full bg-blue-600 border-0 text-white' max={oneMonthBefore()} />
                            <InputError message={
                                errors.hasOwnProperty('omzet_time') === true &&
                                errors?.omzet_time
                            } className={`${errors?.omzet_time && 'block'} mt-2 w-[30rem] xxs:w-full`} />
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

ShowOmzet.layout = page => (
    <AdminLayout title='Ubah Omzet - Admin Toko Sembako Djuju' keyword='ubah omzet dagangan toko sembako djuju' desc='Halaman untuk mengelola omzet dagangan yang ada pada Toko Sembako Djuju' >
        <DashboardLayout children={page} pageName="Ubah Omzet" />
    </AdminLayout>
)