import { Link, useForm } from "@inertiajs/react";
import React, { useRef, useState, useEffect } from "react";


import '../../../../scss/admin/user/_registration.scss';

import TextInput from "@/Components/TextInput";
import AdminLayout from "@/Layouts/AdminLayout";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import DashboardLayout from '../DashboardLayout';
import { Spin } from "@/Components/loading/Spin";
import SuccessAlert from "@/Components/alert/SuccessAlert";
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Registration({latestRecord}) {  
    
    const formRef = useRef(null)

    const [success, setSuccess] = useState(false)

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        address: '',
        phone: '',
        role: '',
    });

    const valuesEmpty = () => {
        return data?.name === '' || data?.email === '' || data?.password === '' || data?.password_confirmation === '' || data?.address === '' || data?.phone === '' || data?.role === ''
    }

    const [passwordType, setPasswordType] = useState("password")
    const changePasswordType = () => {
        passwordType === "password" ? setPasswordType("text") : setPasswordType("password")
    }

    const handleOnChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value}
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('user.store'), {
            onSuccess: () => {
                setSuccess(true)
                setData({
                    name: '',
                    email: '',
                    password: '',
                    password_confirmation: '',
                    address: '',
                    phone: '',
                    role: '',
                })
            },
            onStart() {
                setSuccess(false)
            }
        });
    };

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);
    
    return (
        <div className="registration-component">
            <div id="container_registration">
                <Link href={route('user.dashboard')} className='back-section mt-8 flex items-center gap-x-2'>
                    <ArrowLeftIcon className='w-6 h-6' />
                    <h3 className="montserrat font-medium">Daftar Pengguna</h3>
                </Link>
                {
                    success === true &&
                    <SuccessAlert msg_primary={'Berhasil disimpan! '} time={5000} msg_detail={`Pengguna '${latestRecord?.name}' telah ditambahkan.`} className={'mt-5'} />
                }
                <form onSubmit={handleSubmit} action='post' className='mt-12' ref={formRef}>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div id="name" className='form-control'>
                            <InputLabel htmlFor="name" value="Nama Pengguna" className='text-[1.15rem]' />
                            <TextInput
                                id="name"
                                type="text"
                                name="name"
                                required
                                value={data?.name}
                                autoComplete='on'
                                placeholder='Contoh: James Sullivan'
                                onChange={handleOnChange}
                                className={`${errors.hasOwnProperty('name') === true && 'border border-solid border-red-500'} mt-3 block w-full`}
                            />
                            <InputError message={errors.hasOwnProperty('name') === true && errors?.name} className={`${errors?.name && 'block'} mt-2`} />
                        </div>
                        <div id="email" className='form-control'>
                            <InputLabel htmlFor="email" value="Email" className='text-[1.15rem]' />
                            <TextInput
                                type="email"
                                id="email"
                                required
                                name="email"
                                autoComplete='on'
                                placeholder='email@gmail.com'
                                value={data?.email}
                                onChange={handleOnChange}
                                className={`${errors.hasOwnProperty('email') === true && 'border border-solid border-red-500'} mt-3 block w-full`}
                            />
                            <InputError message={
                                errors.hasOwnProperty('email') === true &&
                                errors?.email
                            } className={`${errors?.email && 'block'} mt-2`} />
                        </div>
                        <div id="password" className='form-control relative'>
                            <InputLabel htmlFor="password" value="Password" className='text-[1.15rem]' />
                            <TextInput
                                type={passwordType}
                                id="password"
                                required
                                name="password"
                                autoComplete='new-password'
                                placeholder='contohPassword12_'
                                value={data?.password}
                                onChange={handleOnChange}
                                className={`${errors.hasOwnProperty('password') === true && 'border border-solid border-red-500'} mt-3 block w-full`}
                            />
                            <span className="absolute top-[49px] right-[10px]" onClick={changePasswordType}>
                            {
                                passwordType === "password" ?
                                    <EyeSlashIcon className={`h-5 w-5 cursor-pointer text-blue-base`} />
                                :
                                    <EyeIcon className={`h-5 w-5 cursor-pointer text-blue-base`} />
                            }
                            </span>
                            <InputError message={
                                errors.hasOwnProperty('password') === true &&
                                errors?.password
                            } className={`${errors?.password && 'block'} mt-2`} />
                        </div>
                        <div id="password_confirmation" className='form-control relative'>
                            <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" className='text-[1.15rem]' />
                            <TextInput
                                type={passwordType}
                                id="password_confirmation"
                                required
                                name="password_confirmation"
                                autoComplete='new-password'
                                placeholder='contohPassword12_'
                                value={data?.password_confirmation}
                                onChange={handleOnChange}
                                className={`${errors.hasOwnProperty('password_confirmation') === true && 'border border-solid border-red-500'} mt-3 block w-full`}
                            />
                            <span className="absolute top-[49px] right-[10px]" onClick={changePasswordType}>
                            {
                                passwordType === "password" ?
                                    <EyeSlashIcon className={`h-5 w-5 cursor-pointer text-blue-base`} />
                                :
                                    <EyeIcon className={`h-5 w-5 cursor-pointer text-blue-base`} />
                            }
                            </span>
                            <InputError message={
                                errors.hasOwnProperty('password_confirmation') === true &&
                                errors?.password_confirmation
                            } className={`${errors?.password_confirmation && 'block'} mt-2`} />
                        </div>
                        <div id="address" className='form-control'>
                            <InputLabel htmlFor="address" value="Alamat" className='text-[1.15rem]' />
                            <TextInput
                                id="address"
                                type="text"
                                name="address"
                                value={data?.address}
                                autoComplete='on'
                                placeholder='Contoh: James Sullivan'
                                onChange={handleOnChange}
                                className={`${errors.hasOwnProperty('address') === true && 'border border-solid border-red-500'} mt-3 block w-full`}
                            />
                            <InputError message={errors.hasOwnProperty('address') === true && errors?.address} className={`${errors?.address && 'block'} mt-2`} />
                        </div>
                        <div id="phone" className='form-control'>
                            <InputLabel htmlFor="phone" value="Nomor Telepon" className='text-[1.15rem]' />
                            <TextInput
                                type="telp"
                                id="phone"
                                name="phone"
                                autoComplete='new-password'
                                placeholder='082134523456'
                                value={data?.phone}
                                onChange={handleOnChange}
                                pattern="^\d{10,12}$"
                                className={`${errors.hasOwnProperty('phone') === true && 'border border-solid border-red-500'} mt-3 block w-full`}
                            />
                            <InputError message={
                                errors.hasOwnProperty('phone') === true &&
                                errors?.phone
                            } className={`${errors?.phone && 'block'} mt-2`} />
                        </div>
                        <div id="role" className='form-control'>
                            <InputLabel htmlFor="role" value="Role Pengguna" className='text-[1.15rem] mb-3' />
                            <select name="role" id="role" className={`${errors.hasOwnProperty('role') === true && 'border border-solid border-red-500'} mt-3 block w-full montserrat rounded-[5px] border-gray-400`} defaultValue={data?.role} onChange={handleOnChange}>
                                <option value="">Pilih role</option>
                                <option value="employee">Pegawai</option>
                                <option value="owner">Admin / Owner</option>
                            </select>

                            <InputError message={
                                errors.hasOwnProperty('role') === true &&
                                errors?.role
                            } className={`${errors?.role && 'block'} mt-2`} />
                        </div>
                    </div>
                    <div className="btn-submit mt-7">
                        <button type="submit" className={` ${valuesEmpty() && 'opacity-20 pointer-events-none'} ${processing && ' pointer-events-none'} w-full text-center rounded-[5px] text-white font-medium text-[1.10rem] montserrat py-3 bg-indigo-500`} disabled={processing}>
                        {
                            processing ? <Spin /> : 'Unggah Data'
                        }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

Registration.layout = page => (
    <AdminLayout title='Tambah Pengguna - Admin Toko Sembako Djuju' keyword='tambah pengguna dagangan toko sembako djuju' desc='Halaman untuk megelola pengguna yang ada pada Toko Sembako Djuju' >
        <DashboardLayout children={page} pageName="Tambah Pengguna" />
    </AdminLayout>
)