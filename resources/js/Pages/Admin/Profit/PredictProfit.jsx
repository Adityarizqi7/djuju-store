import React, { useState } from "react";
import { differenceInMonths } from 'date-fns'

import '../../../../scss/admin/profit/_predictprofit.scss';

import AdminLayout from "@/Layouts/AdminLayout";
import DashboardLayout from '../DashboardLayout';
import { formatedCurrency } from "@/Utils/String"
import { convertMonthReadble, monthYM } from '@/Utils/Date';
import { Link } from "@inertiajs/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function PredictProfit({profit, latest}) {

    const [predictShow, setPredictShow] = useState(false)
    const [date, setDate] = useState({
        month: ''
    })

    const indexLastXOdd = profit?.length - 1 - Math.floor(profit?.length/2)
    const indexLastXEven = profit?.length - 1;
    const [valueA, setValueA] = useState(
        ((profit?.reduce((acc, val) => acc + val?.profit_amount, 0))/profit?.length)?.toFixed(2)
    )
    const [nextXLoop, setNextXLoop] = useState(0)
    let tempNextXLoop = nextXLoop

    // Ganjil
    const [valueBOdd, setValueBOdd] = useState(
        ((profit.reduce((acc, val, i) => {
            const x = (i - Math.floor(profit?.length/2));
            const xy = x * val.profit_amount;
            return acc + xy;
        }, 0))/( profit.reduce((acc, val, i) => {
                return acc + ((i - Math.floor(profit?.length/2))**2);
        }, 0)))?.toFixed(2)
    )

    // Genap
    const [valueBEven, setValueBEven] = useState(
        ((profit.reduce((acc, val, i) => {
            const x = ((i * 2) - (profit?.length - 1));
            const xy = x * val.profit_amount;
            return acc + xy;
        }, 0))/( profit.reduce((acc, val, i) => {
                return acc + (((i * 2) - (profit?.length - 1))**2);
        }, 0)))?.toFixed(2)
    )

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setDate((prevData) => ({ ...prevData, [name]: value }));
        
    };

    const predict = () => {
        setPredictShow(true)
        const date1 = new Date(latest?.profit_time)
        const date2 = new Date(`${date.month}-01`)
        const resultSelisih = differenceInMonths(date2, date1)
        
        if(profit?.length % 2 === 0) {
            tempNextXLoop = 0
            for(let i = 1; i <= resultSelisih; i++) {
                tempNextXLoop += 2
            }
            setNextXLoop(tempNextXLoop)
        }
        
        if(profit?.length % 2 !== 0) {
            tempNextXLoop = 0
            for(let i = 1; i <= resultSelisih; i++) {
                tempNextXLoop += 1
            }
            setNextXLoop(tempNextXLoop)
        }
    }

    return (
        <div className="profit-predict-component">
            <div id="container_profit_predict">
                <Link href={route('profit.dashboard')} className='back-section mt-8 flex items-center gap-x-2'>
                    <ArrowLeftIcon className='w-6 h-6' />
                    <h3 className="montserrat font-medium">Daftar Profit</h3>
                </Link>
                <div className="form-control mt-10">
                    <input type="month" id="date" name='month' value={date?.month} onChange={handleOnChange} className='montserrat rounded-[5px] w-full bg-blue-600 border-0 text-white' min={monthYM()} />
                    <button onClick={predict} className='montserrat px-4 py-2 bg-blue-200 text-blue-800 rounded-sm mt-5'>
                        Hitung
                    </button>
                </div>
                <div className="result-next-omset mt-10 montserrat text-[1.15rem]">
                    <h1>Prediksi Omset untuk bulan {date?.month !== '' ? convertMonthReadble(date?.month) : ''}: <span className="text-orange-500 font-semibold rounded-[5px]">{
                        predictShow === false ?
                        'Belom dihitung'
                        :
                        profit?.length % 2 !== 0 ?
                        formatedCurrency(parseFloat(valueA) + (valueBOdd * (indexLastXOdd + nextXLoop)))
                        :
                        formatedCurrency(parseFloat(valueA) + (valueBEven * (indexLastXEven + nextXLoop)))
                    }</span> </h1>
                </div>
                <div className="all-profit-predict-table mt-10 overflow-x-auto h-[42rem] overflow-y-auto">
                    <table className="w-full text-[1.05rem] text-center text-neutral-800">
                        <thead className="text-white uppercase poppins">
                            <tr className="bg-transparent border-x border-t border-b-0 border-orange-600">
                                <th scope="col" colSpan={5} className="px-6 py-6 text-neutral-900 text-[1.25rem]">
                                    Prediksi Profit
                                </th>
                            </tr>
                            <tr className="bg-orange-600/95 column-name">
                                <th scope="col" className="px-6 py-3">
                                    Waktu
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Profit
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    X
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    X.y
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    X<sup>2</sup>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="montserrat">
                        {
                            profit?.length < 1 ?
                            (
                                <tr className="bg-white border-b">
                                    <td colSpan={5} className="px-6 py-6 text-[1.25rem] text-center">
                                         Tidak ada profit
                                    </td>
                                </tr>
                            )  
                            :
                            profit?.length % 2 === 0 ?
                            profit
                            ?.map((ele, i) => {
                                return (
                                    <tr key={i + 1} className="bg-white border-b even:bg-slate-50">
                                        <td data-column='Bulan dan Tahun Profit' className="px-3 py-4">
                                        {
                                            convertMonthReadble(ele?.profit_time)
                                        }
                                        </td>
                                        <td data-column='Nominal Profit' className="px-3 py-4">
                                        {
                                            formatedCurrency(ele?.profit_amount)
                                        }
                                        </td>
                                        <td data-column='X' className="px-3 py-4">
                                        {
                                            (i * 2) - (profit?.length - 1)
                                        }
                                        </td>
                                        <td data-column='X.Y' className="px-3 py-4">
                                        {
                                            formatedCurrency(((i * 2) - (profit?.length - 1)) * ele?.profit_amount)
                                        }
                                        </td>
                                        <td data-column='X Kuadrat' className="px-3 py-4">
                                        {
                                            ((i * 2) - (profit?.length - 1))**2
                                        }
                                        </td>
                                    </tr>
                                )
                            })
                            :
                            profit
                            ?.map((ele, i) => {
                                return (
                                    <tr key={i + 1} className="bg-white border-b even:bg-slate-50">
                                        <td data-column='Bulan dan Tahun Profit' className="px-3 py-4">
                                        {
                                            convertMonthReadble(ele?.profit_time)
                                        }
                                        </td>
                                        <td data-column='Nominal Profit' className="px-3 py-4">
                                        {
                                            formatedCurrency(ele?.profit_amount)
                                        }
                                        </td>
                                        <td data-column='X' className="px-3 py-4">
                                        {
                                            i - Math.floor(profit?.length/2)
                                        }
                                        </td>
                                        <td data-column='X.Y' className="px-3 py-4">
                                        {
                                            formatedCurrency((i - Math.floor(profit?.length/2)) * ele?.profit_amount)
                                        }
                                        </td>
                                        <td data-column='X Kuadrat' className="px-3 py-4">
                                        {
                                            (i - Math.floor(profit?.length/2))**2
                                        }
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                        <tfoot>
                            <tr className='montserrat border-b bg-gray-100'>
                                <td colSpan={1} className='px-2 py-4 border-r border-gray-200 text-[1.10rem] font-semibold'>Total Profit: {' '} 
                                    <span className='text-orange-600'>
                                    {
                                        formatedCurrency(profit?.reduce((acc, val) => acc + val?.profit_amount, 0))
                                        
                                    } 
                                    </span>
                                </td>
                                <td colSpan={3} className='px-2 py-4 border-r border-gray-200 text-[1.10rem] font-semibold'>
                                    Total X.Y: {' '} 
                                    <span className='text-orange-600'>
                                    {
                                        profit?.length % 2 !== 0 ?
                                        formatedCurrency(
                                        profit.reduce((acc, val, i) => {
                                                const x = i - Math.floor(profit?.length/2);
                                                const xy = x * val.profit_amount;
                                                return acc + xy;
                                        }, 0))
                                        :
                                        formatedCurrency(
                                        profit.reduce((acc, val, i) => {
                                                const x = (i * 2) - (profit?.length - 1);
                                                const xy = x * val.profit_amount;
                                                return acc + xy;
                                        }, 0))
                                    }
                                    </span>
                                </td>
                                <td colSpan={1} className='px-2 py-4 border-r border-gray-200 text-[1.10rem] font-semibold'>
                                    Total X<sup>2</sup>: {' '} 
                                    <span className='text-orange-600'>
                                    {
                                        profit?.length % 2 !== 0 ?
                                        profit.reduce((acc, val, i) => {
                                                return acc + ((i - Math.floor(profit?.length/2))**2);
                                        }, 0)
                                        :
                                        profit.reduce((acc, val, i) => {
                                                return acc + (((i * 2) - (profit?.length - 1))**2);
                                        }, 0)
                                    }
                                    </span>
                                </td>
                            </tr>
                            <tr className='montserrat border-b bg-white'>
                                <td colSpan={2} className='px-2 py-4 border-r border-gray-200 text-[1.10rem] font-semibold'>Total nilai A: {' '}
                                    <span className='text-orange-600'>
                                        {
                                            profit?.length < 1 ?
                                            '-'
                                            :
                                            valueA
                                        }
                                    </span> 
                                </td>
                                <td colSpan={3} className='px-2 py-4 border-r border-gray-200 text-[1.10rem] font-semibold'>
                                    Total nilai B: {' '}
                                    <span className='text-orange-600'>
                                    {
                                        profit?.length < 1 ?
                                        '-'
                                        :
                                        profit?.length % 2 !== 0 ?
                                        ((profit.reduce((acc, val, i) => {
                                                const x = (i - Math.floor(profit?.length/2));
                                                const xy = x * val.profit_amount;
                                                return acc + xy;
                                        }, 0))/( profit.reduce((acc, val, i) => {
                                                return acc + ((i - Math.floor(profit?.length/2))**2);
                                        }, 0)))?.toFixed(2)
                                        :
                                        ((profit.reduce((acc, val, i) => {
                                                const x = ((i * 2) - (profit?.length - 1));
                                                const xy = x * val.profit_amount;
                                                return acc + xy;
                                        }, 0))/( profit.reduce((acc, val, i) => {
                                                return acc + (((i * 2) - (profit?.length - 1))**2);
                                        }, 0)))?.toFixed(2)
                                    }
                                    </span>
                                </td>
                            </tr>
                            <tr className='montserrat border-b bg-gray-100'>
                                <td colSpan={5} className='px-2 py-4 border-r border-gray-200 text-[1.10rem] font-semibold'>
                                    Nilai X pada Bulan {convertMonthReadble(date?.month)} : {' '} 
                                    <span className='text-orange-600'>
                                    {
                                        date?.month === '' ?
                                        <span className='text-orange-600'>Belom dicari</span>
                                        :
                                        profit?.length % 2 !== 0 ?
                                        indexLastXOdd + nextXLoop
                                        :
                                        indexLastXEven + nextXLoop
                                    }
                                    </span>
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

PredictProfit.layout = page => (
    <AdminLayout title='Prediksi Profit - Admin Toko Sembako Djuju' keyword='prediksi profit dagangan toko sembako djuju' desc='Halaman untuk memprediksi profit dagangan yang ada pada Toko Sembako Djuju' >
        <DashboardLayout children={page} pageName="Prediksi Profit" />
    </AdminLayout>
)