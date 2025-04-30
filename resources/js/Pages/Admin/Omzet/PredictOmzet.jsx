import {
    Accordion,
    AccordionHeader,
    AccordionBody,
} from "@material-tailwind/react";
import { Link } from "@inertiajs/react";
import { differenceInMonths } from 'date-fns'
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import React, { Fragment, useCallback, useState } from "react";

import '../../../../scss/admin/omzet/_predictomzet.scss';

import AdminLayout from "@/Layouts/AdminLayout";
import DashboardLayout from '../DashboardLayout';
import { formatedCurrency } from "@/Utils/String"
import { convertMonthReadble, monthYM } from '@/Utils/Date';
import ErrorAlert from "@/Components/alert/ErrorAlert";
import { useEffect } from "react";
import { AreaChart, Card, Title } from "@tremor/react";
import moment from "moment";

function Icon({ id, open }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`${
          id === open ? "rotate-180" : ""
        } h-5 w-5 transition-transform`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    );
}

export default function PredictOmzet({omzet, latest}) {

    const [predictShow, setPredictShow] = useState(false)
    const [failedPredict, setFailedPredict] = useState(false)

    const [open, setOpen] = useState(0);
    const handleOpen = useCallback((value) => {
        setOpen(open === value ? 0 : value);
    }, [open]);

    const [date, setDate] = useState({
        month: ''
    })

    const indexLastXOdd = omzet?.length - 1 - Math.floor(omzet?.length/2)
    const indexLastXEven = omzet?.length - 1;

    const [valueA, setValueA] = useState(
        ((omzet?.reduce((acc, val) => acc + val?.omzet_amount, 0))/omzet?.length)?.toFixed(2)
    )
    const [nextXLoop, setNextXLoop] = useState(0)
    let tempNextXLoop = nextXLoop

    // Ganjil
    const [valueBOdd, setValueBOdd] = useState(
        ((omzet.reduce((acc, val, i) => {
            const x = (i - Math.floor(omzet?.length/2));
            const xy = x * val.omzet_amount;
            return acc + xy;
        }, 0))/( omzet.reduce((acc, val, i) => {
                return acc + ((i - Math.floor(omzet?.length/2))**2);
        }, 0)))?.toFixed(2)
    )

    // Genap
    const [valueBEven, setValueBEven] = useState(
        ((omzet.reduce((acc, val, i) => {
            const x = ((i * 2) - (omzet?.length - 1));
            const xy = x * val.omzet_amount;
            return acc + xy;
        }, 0))/( omzet.reduce((acc, val, i) => {
                return acc + (((i * 2) - (omzet?.length - 1))**2);
        }, 0)))?.toFixed(2)
    )

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setDate((prevData) => ({ ...prevData, [name]: value }));
        
    };

    const predict = () => {
        
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();

        const dateString = date?.month;
        const month = dateString.split("-")[1];

        // if (month && month > currentMonth) {
        //     setPredictShow(true)
        //     const date1 = new Date(latest?.[0]?.omzet_time)
        //     const date2 = new Date(`${date.month}-01`)
        //     const resultSelisih = differenceInMonths(date2, date1)
            
        //     if(omzet?.length % 2 === 0) {
        //         tempNextXLoop = 0
        //         for(let i = 1; i <= resultSelisih; i++) {
        //             tempNextXLoop += 2
        //         }
        //         setNextXLoop(tempNextXLoop)
        //     }
            
        //     if(omzet?.length % 2 !== 0) {
        //         tempNextXLoop = 0
        //         for(let i = 1; i <= resultSelisih; i++) {
        //             tempNextXLoop += 1
        //         }
        //         setNextXLoop(tempNextXLoop)
        //     }
        // } else {
        //     setFailedPredict(true)
        // }

        if (date?.month > '2022-12') {
            setPredictShow(true)
            const date1 = new Date(latest?.[0]?.omzet_time)
            const date2 = new Date(`${date.month}-01`)
            const resultSelisih = differenceInMonths(date2, date1)
            
            if(omzet?.length % 2 === 0) {
                tempNextXLoop = 0
                for(let i = 1; i <= resultSelisih; i++) {
                    tempNextXLoop += 2
                }
                setNextXLoop(tempNextXLoop)
            }
            
            if(omzet?.length % 2 !== 0) {
                tempNextXLoop = 0
                for(let i = 1; i <= resultSelisih; i++) {
                    tempNextXLoop += 1
                }
                setNextXLoop(tempNextXLoop)
            }
        } else {
            setFailedPredict(true)
        }
    }

    useEffect(() => {
        let timeoutId = null;
        
        if (failedPredict) {
            timeoutId = setTimeout(() => {
            setFailedPredict(false);
            }, 3000);
        }
        
        return () => {
            clearTimeout(timeoutId);
        };
    }, [failedPredict]);              

    const MAPE_EVEN = (((1/12)*
    (omzet?.reduce((acc, ele, i) => {
            const prediction = Math.abs(
                parseFloat(ele?.omzet_amount - parseFloat((parseFloat(valueA) + (parseFloat(valueBEven) * ((i * 2) - (omzet?.length - 1)))).toFixed(2))).toFixed(2) / ele?.omzet_amount
            ).toFixed(9)
            
            return acc + parseFloat(prediction)}, 0
        ))?.toFixed(9)
    )*100)?.toFixed(2)

    const MAPE_ODD = (((1/12)*(
        (omzet?.reduce((acc, ele, i) => {
            const prediction = Math.abs(
                parseFloat(ele?.omzet_amount - parseFloat((parseFloat(valueA) + (parseFloat(valueBEven) * ((i - Math.floor(omzet?.length/2))))).toFixed(2))).toFixed(2) / ele?.omzet_amount
            ).toFixed(9)
            
            return acc + parseFloat(prediction)}, 0
        ))?.toFixed(9)
    ))*100)?.toFixed(2)
    
    return (
        <div className="omzet-predict-component">
            <div id="container_omzet_predict">
                <Link href={route('omzet.dashboard')} className='back-section mt-8 flex items-center gap-x-2'>
                    <ArrowLeftIcon className='w-6 h-6' />
                    <h3 className="montserrat font-medium">Daftar Omzet</h3>
                </Link>
                <div className="form-control mt-10">
                    <input type="month" id="date" name='month' value={date?.month} onChange={handleOnChange} className='montserrat rounded-[5px] w-full bg-blue-600 border-0 text-white' min={monthYM()} />
                    <button onClick={predict} className='montserrat px-4 py-2 bg-blue-200 text-blue-800 rounded-sm mt-5'>
                        Hitung
                    </button>
                </div>
                <div className="result-next-omset mt-10 montserrat text-[1.15rem] space-y-6">
                    <h1>Prediksi Omset yang akan didapatkan untuk bulan {date?.month !== '' ? convertMonthReadble(date?.month) : ''}: 
                    <span className="text-orange-500 font-semibold rounded-[5px]">{
                        predictShow === false ?
                        ' Belom dihitung '
                        :
                        omzet?.length % 2 !== 0 ?
                        ` ${(parseFloat(valueA) + (valueBOdd * (indexLastXOdd + nextXLoop))).toFixed(2)} `
                        :
                        ` ${(parseFloat(valueA) + (valueBEven * (indexLastXEven + nextXLoop))).toFixed(2)} `
                    }</span> 
                    atau
                    <span className="text-orange-500 font-semibold rounded-[5px]">{
                        predictShow === false ?
                        ' Belom dihitung'
                        :
                        omzet?.length % 2 !== 0 ?
                        ` ${formatedCurrency(parseFloat(valueA) + (valueBOdd * (indexLastXOdd + nextXLoop)))} `
                        :
                        ` ${formatedCurrency(parseFloat(valueA) + (valueBEven * (indexLastXEven + nextXLoop)))} `
                    }</span> 
                    </h1>
                </div>
                {
                    failedPredict === true &&
                    <ErrorAlert msg_primary={'Tidak berhasil! '} msg_detail={`Tanggal yang diprediksi sudah kedaluwarsa!`} className={'mt-8 fixed right-4 top-0 xxs:left-4'} />
                }
                <Fragment>
                    <Accordion open={open === 1} icon={<Icon id={1} open={open} />}>
                        <AccordionHeader onClick={() => handleOpen(1)} className='montserrat'>
                            Statistik Perhitungan Prediksi Omzet
                        </AccordionHeader>
                        <AccordionBody>
                            <div className="result-next-omset-rumus mt-2 montserrat text-[1.15rem] space-y-3">
                                <h1>
                                    Tingkat akurasi prediksi omzet sebesar {' '}
                                    <span className='text-orange-500 font-semibold'>
                                    {
                                        omzet?.length % 2 === 0 ?
                                            MAPE_EVEN + '%'
                                        :
                                            MAPE_ODD + '%'
                                    }
                                    {

                                    }
                                    </span>
                                    {' '} yang artinya
                                    <u>
                                    {
                                        omzet?.length % 2 === 0 ?
                                            MAPE_EVEN < 10 ?
                                            ' tingkat akurasi prediksi sangat baik'
                                            :
                                            MAPE_EVEN >= 10 || MAPE_EVEN <= 20 ?
                                            ' tingkat akurasi prediksi baik'
                                            :
                                            MAPE_EVEN > 20 || MAPE_EVEN <= 50 ?
                                            ' tingkat akurasi prediksi layak atau memadai'
                                            :
                                            MAPE_EVEN > 50 &&
                                            ' tingkat akurasi prediksi sangat buruk'
                                        :
                                            MAPE_ODD < 10 ?
                                            ' tingkat akurasi prediksi sangat baik'
                                            :
                                            MAPE_ODD >= 10 || MAPE_ODD <= 20 ?
                                            ' tingkat akurasi prediksi baik'
                                            :
                                            MAPE_ODD > 20 || MAPE_ODD <= 50 ?
                                            ' tingkat akurasi prediksi layak atau memadai'
                                            :
                                            MAPE_ODD > 50 &&
                                            ' tingkat akurasi prediksi sangat buruk'
                                    }
                                    </u>.
                                </h1>
                                <div className='space-y-3'>
                                    <h1>Rumus Algoritma <i>Least Square</i></h1>
                                    <h2 className="font-semibold rounded-[5px]">
                                    {
                                        `Y = ${parseFloat(valueA)} + (${valueBEven}) (${(indexLastXEven + nextXLoop)})`
                                    }
                                    </h2>
                                    <h2 className="font-semibold rounded-[5px]">
                                    {
                                        `Y = ${parseFloat(valueA)} + (${(valueBEven * (indexLastXEven + nextXLoop))?.toFixed(2)})`
                                    }
                                    </h2>
                                </div>
                            </div>
                            <div className="all-omzet-predict-table mt-4 overflow-x-auto h-[55rem] overflow-y-auto">
                                <table className="w-full text-[1.05rem] text-center text-neutral-800">
                                    <thead className="text-white uppercase poppins">
                                        <tr className="bg-transparent border-x border-t border-b-0 border-orange-600">
                                            <th scope="col" colSpan={7} className="px-6 py-6 text-neutral-900 text-[1.25rem]">
                                                Prediksi Omzet
                                            </th>
                                        </tr>
                                        <tr className="bg-orange-600/95 column-name">
                                            <th scope="col" className="px-6 py-3">
                                                Waktu
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Omzet
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
                                            <th scope="col" className="px-6 py-3">
                                                Prediksi
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                PE (<i>Percentage Error</i>)
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="montserrat">
                                    {
                                        omzet?.length < 1 ?
                                        (
                                            <tr className="bg-white border-b">
                                                <td colSpan={4} className="px-6 py-6 text-[1.25rem] text-center">
                                                    Tidak ada omzet
                                                </td>
                                            </tr>
                                        )  
                                        :
                                        omzet?.length % 2 === 0 ?
                                        omzet
                                        ?.map((ele, i) => {
                                            return (
                                                <tr key={i + 1} className="bg-white border-b even:bg-slate-50">
                                                    <td data-column='Bulan dan Tahun Omzet' className="px-3 py-4">
                                                    {
                                                        convertMonthReadble(ele?.omzet_time)
                                                    }
                                                    </td>
                                                    <td data-column='Nominal Omzet' className="px-3 py-4">
                                                    {
                                                        formatedCurrency(ele?.omzet_amount)
                                                    }
                                                    </td>
                                                    <td data-column='X' className="px-3 py-4">
                                                    {
                                                        (i * 2) - (omzet?.length - 1)
                                                    }
                                                    </td>
                                                    <td data-column='X.Y' className="px-3 py-4">
                                                    {
                                                        formatedCurrency(((i * 2) - (omzet?.length - 1)) * ele?.omzet_amount)
                                                    }
                                                    </td>
                                                    <td data-column='X Kuadrat' className="px-3 py-4">
                                                    {
                                                        ((i * 2) - (omzet?.length - 1))**2
                                                    }
                                                    </td>
                                                    <td data-column='Prediksi' className="px-3 py-4">
                                                    {
                                                        formatedCurrency((parseFloat(valueA) + (parseFloat(valueBEven) * ((i * 2) - (omzet?.length - 1)))))
                                                    }
                                                    </td>
                                                    <td data-column='PE' className="px-3 py-4">
                                                    {
                                                        (
                                                            Math.abs(
                                                                (parseFloat(ele?.omzet_amount - parseFloat((parseFloat(valueA) + (parseFloat(valueBEven) * ((i * 2) - (omzet?.length - 1)))).toFixed(2))).toFixed(2) / ele?.omzet_amount)*100
                                                            ).toFixed(7)
                                                        )
                                                    }
                                                    </td>
                                                </tr>
                                            )
                                        })
                                        :
                                        omzet
                                        ?.map((ele, i) => {
                                            return (
                                                <tr key={i + 1} className="bg-white border-b even:bg-slate-50">
                                                    <td data-column='Bulan dan Tahun Omzet' className="px-3 py-4">
                                                    {
                                                        convertMonthReadble(ele?.omzet_time)
                                                    }
                                                    </td>
                                                    <td data-column='Nominal Omzet' className="px-3 py-4">
                                                    {
                                                        formatedCurrency(ele?.omzet_amount)
                                                    }
                                                    </td>
                                                    <td data-column='X' className="px-3 py-4">
                                                    {
                                                        i - Math.floor(omzet?.length/2)
                                                    }
                                                    </td>
                                                    <td data-column='X.Y' className="px-3 py-4">
                                                    {
                                                        formatedCurrency((i - Math.floor(omzet?.length/2)) * ele?.omzet_amount)
                                                    }
                                                    </td>
                                                    <td data-column='X Kuadrat' className="px-3 py-4">
                                                    {
                                                        (i - Math.floor(omzet?.length/2))**2
                                                    }
                                                    </td>
                                                    <td data-column='Prediksi' className="px-3 py-4">
                                                    {
                                                        formatedCurrency(parseFloat(valueA) + (parseFloat(valueBOdd) * (i - Math.floor(omzet?.length/2))))
                                                    }
                                                    </td>
                                                    <td data-column='PE' className="px-3 py-4">
                                                    {
                                                        (
                                                            (
                                                                (parseFloat(ele?.omzet_amount - parseFloat((parseFloat(valueA) + (parseFloat(valueBOdd) * (i - Math.floor(omzet?.length/2)))).toFixed(2))).toFixed(2) / ele?.omzet_amount)*100
                                                            ).toFixed(7)
                                                        )
                                                    }
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                    </tbody>
                                    <tfoot>
                                        <tr className='montserrat border-b bg-gray-100'>
                                            <td colSpan={3} className='px-2 py-4 border-r border-gray-200 text-[1.10rem] font-semibold'>Total Omzet: {' '} 
                                                <span className='text-orange-600'>
                                                {
                                                    formatedCurrency(omzet?.reduce((acc, val) => acc + val?.omzet_amount, 0))
                                                    
                                                } 
                                                </span>
                                            </td>
                                            <td colSpan={3} className='px-2 py-4 border-r border-gray-200 text-[1.10rem] font-semibold'>
                                                Total X.Y: {' '} 
                                                <span className='text-orange-600'>
                                                {
                                                    omzet?.length % 2 !== 0 ?
                                                    formatedCurrency(
                                                    omzet.reduce((acc, val, i) => {
                                                            const x = i - Math.floor(omzet?.length/2);
                                                            const xy = x * val.omzet_amount;
                                                            return acc + xy;
                                                    }, 0))
                                                    :
                                                    formatedCurrency(
                                                    omzet.reduce((acc, val, i) => {
                                                            const x = (i * 2) - (omzet?.length - 1);
                                                            const xy = x * val.omzet_amount;
                                                            return acc + xy;
                                                    }, 0))
                                                }
                                                </span>
                                            </td>
                                            <td colSpan={1} className='px-2 py-4 border-r border-gray-200 text-[1.10rem] font-semibold'>
                                                Total X<sup>2</sup>: {' '} 
                                                <span className='text-orange-600'>
                                                {
                                                    omzet?.length % 2 !== 0 ?
                                                    omzet.reduce((acc, val, i) => {
                                                            return acc + ((i - Math.floor(omzet?.length/2))**2);
                                                    }, 0)
                                                    :
                                                    omzet.reduce((acc, val, i) => {
                                                            return acc + (((i * 2) - (omzet?.length - 1))**2);
                                                    }, 0)
                                                }
                                                </span>
                                            </td>
                                        </tr>
                                        <tr className='montserrat border-b bg-white'>
                                            <td colSpan={3} className='px-2 py-4 border-r border-gray-200 text-[1.10rem] font-semibold'>Total nilai A: {' '}
                                                <span className='text-orange-600'>
                                                    {
                                                        omzet?.length < 1 ?
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
                                                    omzet?.length < 1 ?
                                                    '-'
                                                    :
                                                    omzet?.length % 2 !== 0 ?
                                                    ((omzet.reduce((acc, val, i) => {
                                                            const x = (i - Math.floor(omzet?.length/2));
                                                            const xy = x * val.omzet_amount;
                                                            return acc + xy;
                                                    }, 0))/( omzet.reduce((acc, val, i) => {
                                                            return acc + ((i - Math.floor(omzet?.length/2))**2);
                                                    }, 0)))?.toFixed(2)
                                                    :
                                                    ((omzet.reduce((acc, val, i) => {
                                                            const x = ((i * 2) - (omzet?.length - 1));
                                                            const xy = x * val.omzet_amount;
                                                            return acc + xy;
                                                    }, 0))/( omzet.reduce((acc, val, i) => {
                                                            return acc + (((i * 2) - (omzet?.length - 1))**2);
                                                    }, 0)))?.toFixed(2)
                                                }
                                                </span>
                                            </td>
                                            <td colSpan={1} className='px-2 py-4 border-r border-gray-200 text-[1.10rem] font-semibold'>
                                                Total nilai PE: {' '}
                                                <span className='text-orange-600'>
                                                {
                                                    omzet?.length < 1 ?
                                                    '-'
                                                    :
                                                    omzet?.length % 2 !== 0 ?
                                                    (omzet?.reduce((acc, ele, i) => {
                                                        const prediction = Math.abs(
                                                            (parseFloat(ele?.omzet_amount - parseFloat((parseFloat(valueA) + (parseFloat(valueBEven) * ((i - Math.floor(omzet?.length/2))))).toFixed(2))).toFixed(2) / ele?.omzet_amount)*100
                                                        ).toFixed(7)
                                                        
                                                        return acc + parseFloat(prediction)}, 0
                                                    ))?.toFixed(7)
                                                    :
                                                    (omzet?.reduce((acc, ele, i) => {
                                                        const prediction = Math.abs(
                                                            (parseFloat(ele?.omzet_amount - parseFloat((parseFloat(valueA) + (parseFloat(valueBEven) * ((i * 2) - (omzet?.length - 1)))).toFixed(2))).toFixed(2) / ele?.omzet_amount)*100
                                                        ).toFixed(7)
                                                        
                                                        return acc + parseFloat(prediction)}, 0
                                                    ))?.toFixed(7)
                                                }
                                                </span>
                                            </td>
                                        </tr>
                                        <tr className='montserrat border-b bg-gray-100'>
                                            <td colSpan={6} className='px-2 py-4 border-r border-gray-200 text-[1.10rem] font-semibold'>
                                                Nilai X pada Bulan {date?.month === '' ? '' : convertMonthReadble(date?.month) } : {' '} 
                                                <span className='text-orange-600'>
                                                {
                                                    date?.month === '' ?
                                                    <span className='text-orange-600'>Belom dicari</span>
                                                    :
                                                    omzet?.length % 2 !== 0 ?
                                                    indexLastXOdd + nextXLoop
                                                    :
                                                    indexLastXEven + nextXLoop
                                                }
                                                </span>
                                            </td>
                                            <td colSpan={1} className='px-2 py-4 border-r border-gray-200 text-[1.10rem] font-semibold'>
                                                Nilai MAPE : {' '} 
                                                <span className='text-orange-600'>
                                                {
                                                    omzet?.length % 2 === 0 ?
                                                    (((1/12)*
                                                        (omzet?.reduce((acc, ele, i) => {
                                                            const prediction = Math.abs(
                                                                parseFloat(ele?.omzet_amount - parseFloat((parseFloat(valueA) + (parseFloat(valueBEven) * ((i * 2) - (omzet?.length - 1)))).toFixed(2))).toFixed(2) / ele?.omzet_amount
                                                            ).toFixed(9)
                                                            
                                                            return acc + parseFloat(prediction)}, 0
                                                        ))?.toFixed(9)
                                                    )*100)?.toFixed(2) + '%'
                                                    :
                                                    (((1/12)*(
                                                        (omzet?.reduce((acc, ele, i) => {
                                                            const prediction = Math.abs(
                                                                parseFloat(ele?.omzet_amount - parseFloat((parseFloat(valueA) + (parseFloat(valueBEven) * ((i - Math.floor(omzet?.length/2))))).toFixed(2))).toFixed(2) / ele?.omzet_amount
                                                            ).toFixed(9)
                                                            
                                                            return acc + parseFloat(prediction)}, 0
                                                        ))?.toFixed(9)
                                                    ))*100)?.toFixed(2) + '%'
                                                }
                                                </span>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <Card className='mx-4 mt-5 mb-10 w-auto'>
                                <Title className='poppins font-semibold text-center text-[1.5rem]'>Prediksi Omzet</Title>
                                <AreaChart
                                    data={
                                        omzet?.map((data, i) => ({
                                            aktual: data?.omzet_amount,
                                            prediksi: (parseFloat(valueA) + (parseFloat(valueBEven) * ((i * 2) - (omzet?.length - 1)))),
                                            date: moment(data?.omzet_time, "YYYY-MM").format("MMM-YYYY")
                                        }))
                                    }
                                    index="date"
                                    yAxisWidth={82}
                                    showLegend={true}
                                    colors={["indigo", 'fuchsia']}
                                    className="h-80 mt-4 poppins"
                                    categories={['aktual',"prediksi"]}
                                    valueFormatter={formatedCurrency}
                                />
                            </Card>
                        </AccordionBody>
                    </Accordion>
                </Fragment>
                {/* <Pagination className='mt-6' links={products?.links}/> */}
            </div>
        </div>
    )
}

PredictOmzet.layout = page => (
    <AdminLayout title='Prediksi Omzet - Admin JujuMart' keyword='prediksi omzet dagangan JujuMart' desc='Halaman untuk memprediksi omzet dagangan yang ada pada JujuMart' >
        <DashboardLayout children={page} pageName="Prediksi Omzet" />
    </AdminLayout>
)