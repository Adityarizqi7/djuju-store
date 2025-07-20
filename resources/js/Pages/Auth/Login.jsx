import { useEffect, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

import '../../../scss/admin/_signin.scss'

import Checkbox from '@/Components/Checkbox';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { Spin } from '@/Components/loading/Spin';
import { EyeIcon } from "@heroicons/react/24/outline";
import PrimaryButton from '@/Components/PrimaryButton';
import { EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Login() {
    
    const { data, setData, post, processing, errors, reset } = useForm({
        email: 'djujustore@gmail.com',
        password: 'djujustore02_',
        remember: false,
    });

    const [passwordType, setPasswordType] = useState("password")
    const changePasswordType = () => {
        passwordType === "password" ? setPasswordType("text") : setPasswordType("password")
    }

    // useEffect(() => {
    //     return () => {
    //         reset('password');
    //     };
    // }, []);

    const valuesEmpty = () => {
        return data?.email === "" || data?.password === ""
    }

    const handleOnChange = (event) => {
        const { name, value, checked, type } = event.target;
        setData(name, type === 'checkbox' ? checked : value);

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (data.remember === true) {
            localStorage.setItem('email', data.email);
            localStorage.setItem('password', data.password);
          } else {
            localStorage.removeItem('email');
            localStorage.removeItem('password');
        }

        post(route('login'), { replace: true });
    };

    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');

    useEffect(() => {
        if (email && password) {
            setData({
                email: email,
                password: password,
                remember: true
            });
        }
    }, [email, password]);

    return (
        <GuestLayout>
            <Head title="Masuk - JujuMart" />

            {/* {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>} */}

            <form onSubmit={handleSubmit} className='pb-5'>
                <div className="greeting montserrat text-center pt-4 pb-9">
                    <h3 className='font-semibold text-[1.75rem]'>Masuk ke JujuMart</h3>
                    <h3 className='text-[1.10rem] mt-1'>Yuk, lanjutkan kelola inventorynya.</h3>
                </div>
                <div className='form-control'>
                    <InputLabel htmlFor="email" value="Email" className='text-sm' />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        required={true}
                        value={data?.email}
                        autoComplete="username"
                        onChange={handleOnChange}
                        className={`${errors.hasOwnProperty('email') === true && 'border border-solid border-red-500'} mt-3 block w-full`}
                    />
                    <InputError message={errors.hasOwnProperty('email') === true ? 'Kredensial yang dimasukkan belom terdaftar.' : 'Email harus berupa alamat email yang sudah terdaftar!'} className={`${errors?.email ? 'block' : 'hidden'} mt-2`} />
                </div>

                <div className="form-control mt-7 relative">
                    <InputLabel htmlFor="password" value="Password" className='text-sm' />
                        <TextInput
                            id="password"
                            type={passwordType}
                            name="password"
                            required={true}
                            value={data?.password}
                            onChange={handleOnChange}
                            autoComplete="current-password"
                            className="mt-3 block w-full pr-9"
                        />
                        <span className="absolute top-[42px] right-[10px]" onClick={changePasswordType}>
                            {
                                passwordType === "password" ?
                                    <EyeSlashIcon className={`h-5 w-5 cursor-pointer text-blue-base`} />
                                :
                                    <EyeIcon className={`h-5 w-5 cursor-pointer text-blue-base`} />
                            }
                        </span>

                    <InputError message={'Password tidak boleh kosong.'} className="mt-2 hidden" />
                </div>

                <div className="block mt-4">
                    <label className="flex items-center cursor-pointer">
                        <Checkbox name="remember" value={data?.remember} checked={
                            data?.remember === true
                        } onChange={handleOnChange} className='cursor-pointer' />
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 montserrat">Remember me</span>
                    </label>
                </div>

                <div className="mt-6">
                    <PrimaryButton className={ valuesEmpty() ? "montserrat pointer-events-none opacity-20 w-full" : "montserrat w-full"} disabled={processing}>
                        {
                            processing ? <Spin /> : 'Sign in'
                        }
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
