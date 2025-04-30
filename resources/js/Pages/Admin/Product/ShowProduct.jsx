import React, { useRef, useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Link, useForm } from "@inertiajs/react";

import '../../../../scss/admin/product/_showproduct.scss';

import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import DashboardLayout from '../DashboardLayout';
import { Spin } from "@/Components/loading/Spin";
import SuccessAlert from "@/Components/alert/SuccessAlert";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function ShowProduct({product}) {  

    const [success, setSuccess] = useState(false)
    const formRef = useRef(null)

    const { data, setData, put, processing, errors, reset } = useForm({
        name: product?.name,
        unit: product?.unit,
        sell_price: product?.sell_price,
        stock: product?.stock,
        initial_price: product?.initial_price,
    });

    const valuesEmpty = () => {
        return data?.name === "" || data?.sell_price === "" || data?.unit === '' || data?.initial_price === '' || data?.stock === ''
    }

    const handleOnChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value}
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('product.update', product?.id), {
            onSuccess: () => {
                setSuccess(true)
            }
        });
    };
    
    return (
        <div className="show-product-component">
            <div id="container_show_product">
                <Link href={route('product.dashboard')} className='back-section mt-8 flex items-center gap-x-2'>
                    <ArrowLeftIcon className='w-6 h-6' />
                    <h3 className="montserrat font-medium">Daftar Barang</h3>
                </Link>
                {
                    success === true &&
                    <SuccessAlert msg_primary={'Berhasil diperbarui! '} msg_detail={`Pembaruan Barang '${product?.name}' telah disimpan.`} className={'mt-5'} />
                }
                <form onSubmit={handleSubmit} action='post' className='mt-12' ref={formRef}>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div id="name_product" className='form-control'>
                            <InputLabel htmlFor="name" value="Nama Barang" className='text-[1.15rem]' />
                            <TextInput
                                id="name"
                                type="text"
                                name="name"
                                required={true}
                                value={data?.name}
                                autoComplete='on'
                                placeholder='Contoh: Minyak Goreng'
                                onChange={handleOnChange}
                                className={`${errors.hasOwnProperty('name') === true && 'border border-solid border-red-500'} mt-3 block w-full`}
                            />
                            <InputError message={errors.hasOwnProperty('name') === true && errors?.name} className={`${errors?.name && 'block'} mt-2`} />
                        </div>
                        <div id="product_code" className='form-control'>
                            <InputLabel htmlFor="product_code" value="Kode Barang" className='text-[1.15rem]' />
                            <TextInput
                                id="product_code"
                                type="text"
                                name="product_code"
                                required={true}
                                readOnly={true}
                                placeholder='...'
                                value={product?.product_code}
                                onChange={handleOnChange}
                                className={`${errors.hasOwnProperty('product_code') === true && 'border border-solid border-red-500'} mt-3 block w-full cursor-default`}
                            />
                            <InputError message={errors.hasOwnProperty('product_code') === true && errors?.product_code} className={`${errors?.product_code && 'block'} mt-2`} />
                        </div>
                        <div id="sell_price" className='form-control'>
                            <InputLabel htmlFor="sell_price" value="Harga Jual" className='text-[1.15rem]' />
                            <TextInput
                                type="text"
                                id="sell_price"
                                required={true}
                                name="sell_price"
                                autoComplete='on'
                                placeholder='Contoh: 12000'
                                value={data?.sell_price}
                                pattern="^(?!0+$)[0-9]+$"
                                onChange={handleOnChange}
                                className={`${errors.hasOwnProperty('sell_price') === true && 'border border-solid border-red-500'} mt-3 block w-full`}
                            />
                            <InputError message={
                                errors.hasOwnProperty('sell_price') === true &&
                                errors?.sell_price
                            } className={`${errors?.sell_price && 'block'} mt-2`} />
                        </div>
                        <div id="initial_price" className='form-control'>
                            <InputLabel htmlFor="initial_price" value="Harga Kulak" className='text-[1.15rem]' />
                            <TextInput
                                type="text"
                                id="initial_price"
                                required={true}
                                name="initial_price"
                                autoComplete='on'
                                placeholder='Contoh: 12000'
                                value={data?.initial_price}
                                pattern="^(?!0+$)[0-9]+$"
                                onChange={handleOnChange}
                                className={`${errors.hasOwnProperty('initial_price') === true && 'border border-solid border-red-500'} mt-3 block w-full`}
                            />
                            <InputError message={
                                errors.hasOwnProperty('initial_price') === true &&
                                errors?.initial_price
                            } className={`${errors?.initial_price && 'block'} mt-2`} />
                        </div>
                        <div id="unit" className='form-control'>
                            <InputLabel htmlFor="unit" value="Satuan" className='text-[1.15rem]' />
                            <select name="unit" id="unit" className={`${errors.hasOwnProperty('unit') === true && 'border border-solid border-red-500'} mt-3 block w-full montserrat rounded-[5px] border-gray-400`} defaultValue={data?.unit} onChange={handleOnChange}>
                                <option value="pcs">Piece</option>
                                <option value="kardus">Kardus</option>
                                <option value="kg">Kilogram</option>
                            </select>

                            <InputError message={
                                errors.hasOwnProperty('unit') === true &&
                                errors?.unit
                            } className={`${errors?.unit && 'block'} mt-2`} />
                        </div>
                        <div id="stock" className='form-control'>
                            <InputLabel htmlFor="stock" value="Stok Barang" className='text-[1.15rem]' />
                            <TextInput
                                type="text"
                                id="stock"
                                required={true}
                                name="stock"
                                autoComplete='on'
                                placeholder='Contoh: 100'
                                value={data?.stock}
                                pattern="^[0-9]+$"
                                onChange={handleOnChange}
                                className={`${errors.hasOwnProperty('stock') === true && 'border border-solid border-red-500'} mt-3 block w-full`}
                            />
                            <InputError message={
                                errors.hasOwnProperty('stock') === true &&
                                errors?.stock
                            } className={`${errors?.stock && 'block'} mt-2`} />
                        </div>
                    </div>
                    <div className="btn-submit mt-7">
                        <button type="submit" className={` ${valuesEmpty() && 'opacity-20 pointer-events-none'} w-full text-center rounded-[5px] text-white font-medium text-[1.10rem] montserrat py-3 bg-indigo-500`} disabled={processing}>
                        {
                            processing ? <Spin /> : 'Perbarui Data'
                        }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

ShowProduct.layout = page => (
    <AdminLayout title='Ubah Barang - Admin JujuMart' keyword='lihat dan edit barang dagangan JujuMart' desc='Halaman untuk mengelola barang atau produk dagangan yang ada pada JujuMart' >
        <DashboardLayout children={page} pageName="Ubah Barang" />
    </AdminLayout>
)