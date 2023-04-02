import React from "react";
import moment from "moment";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { BadgeDelta, Card, Grid, Flex, Metric, ProgressBar, Text, Col, Title, Icon, AreaChart, ListItem, List, } from "@tremor/react";

import '../../../scss/admin/_dashboardindex.scss';

import AdminLayout from "@/Layouts/AdminLayout";
import { formatedCurrency } from "@/Utils/String";
import DashboardLayout from '@/Pages/Admin/DashboardLayout';
import { dateYMD, dayYesterdayYMD, monthYesterdayYMD, monthYM } from "@/Utils/Date";
import { usePage } from "@inertiajs/react";

export default function Dashboard({notes, omzet, modal}) {

    const { auth } = usePage().props

    /* Omzet Bulanan */
    const targetOmzetMonth = 500000
    const omzetMonthTotal = notes?.filter(e => e?.created_transaction_at?.slice(0, 7) === monthYM())?.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.cost_subtotal;
    }, 0);
    const omzetMonthTotalFormatted = formatedCurrency(omzetMonthTotal)
    const omzetMonthYesterdayTotal = notes?.filter(e => e?.created_transaction_at?.slice(0, 7) === monthYesterdayYMD())?.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.cost_subtotal;
    }, 0);
    const omzetMonthPercentage =  omzetMonthYesterdayTotal !== 0 ? (((omzetMonthTotal - omzetMonthYesterdayTotal) / omzetMonthYesterdayTotal) * 100)?.toFixed(1) : 0
    
    /* Omzet Harian */
    const targetOmzetToday = 25000
    const omzetTodayTotal = notes?.filter(e => e?.created_transaction_at?.split(' ')[0] === dateYMD())?.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.cost_subtotal;
    }, 0);
    const omzetTodayTotalFormatted = formatedCurrency(omzetTodayTotal)
    const omzetYesterdayTotal = notes?.filter(e => e?.created_transaction_at?.split(' ')[0] === dayYesterdayYMD())?.reduce((accumulator, currentValue) => {
        return accumulator + currentValue?.cost_subtotal;
    }, 0);
    const omzetTodayPercentage =  omzetYesterdayTotal !== 0 ? (((omzetTodayTotal - omzetYesterdayTotal) / omzetYesterdayTotal) * 100)?.toFixed(1) : 0

    /* Transaksi Bulanan */
    const targetNoteMonthLength = 100
    const noteMonthLengthTotal = notes?.filter(e => e?.created_transaction_at?.slice(0, 7) === monthYM())?.length;
    const noteMonthYesterdayLengthTotal = notes?.filter(e => e?.created_transaction_at?.slice(0, 7) === monthYesterdayYMD())?.length;
    const noteMonthLengthPercentage =  noteMonthYesterdayLengthTotal !== 0 ? (((noteMonthLengthTotal - noteMonthYesterdayLengthTotal) / noteMonthYesterdayLengthTotal) * 100)?.toFixed(1) : 0

    /* Profit Bulan Ini */
    const modalThisMonth = modal?.filter(value => value?.asset_time === monthYM())?.reduce((accumulator, currentValue) => {
        return accumulator + currentValue?.cost_total
    }, 0)
    const profitThisMonth = omzetMonthTotal - modalThisMonth

    return (
        <div className="dashboardindex-component">
            <div id="container_dashboardindex">
                <Grid
                    numColsSm={2}
                    numColsLg={3}
                    className="mt-6 gap-6"
                >
                    <Card className='poppins'>
                        <Flex alignItems="start">
                            <div className="truncate">
                                <Text>Omzet Bulan Ini</Text>
                                <Metric className="truncate">{omzetMonthTotalFormatted}</Metric>
                            </div>
                            <BadgeDelta deltaType={omzetMonthTotal >= omzetMonthYesterdayTotal ? 'increase' : 'decrease'}>{`${omzetMonthPercentage}%`}</BadgeDelta>
                        </Flex>
                        <Flex className="mt-4 space-x-2">
                            <Text className="truncate">{`${(omzetMonthTotal/targetOmzetMonth)*100}% (${omzetMonthTotal})`}</Text>
                            <Text>{formatedCurrency(targetOmzetMonth)}</Text>
                        </Flex>
                        <ProgressBar percentageValue={(omzetMonthTotal/targetOmzetMonth)*100} className="mt-2" />
                    </Card>

                    <Card className='poppins'>
                        <Flex alignItems="start">
                            <div className="truncate">
                                <Text>Omzet Hari ini</Text>
                                <Metric className="truncate">{omzetTodayTotalFormatted}</Metric>
                            </div>
                            <BadgeDelta deltaType={omzetTodayTotal >= omzetYesterdayTotal ? 'increase' : 'decrease'}>{`${omzetTodayPercentage}%`}</BadgeDelta>
                        </Flex>
                        <Flex className="mt-4 space-x-2">
                            <Text className="truncate">{`${(omzetTodayTotal/targetOmzetToday)*100}% (${omzetTodayTotal})`}</Text>
                            <Text>{formatedCurrency(targetOmzetToday)}</Text>
                        </Flex>
                        <ProgressBar percentageValue={(omzetTodayTotal/targetOmzetToday)*100} className="mt-2" />
                    </Card>

                    <Card className='poppins'>
                        <Flex alignItems="start">
                            <div className="truncate">
                                <Text>Total Jumlah Transaksi Bulan Ini</Text>
                                <Metric className="truncate">{Number(noteMonthLengthTotal).toLocaleString('en')}</Metric>
                            </div>
                            <BadgeDelta deltaType={noteMonthLengthTotal >= noteMonthYesterdayLengthTotal ? 'increase' : 'decrease'}>{`${noteMonthLengthPercentage}%`}</BadgeDelta>
                        </Flex>
                        <Flex className="mt-4 space-x-2">
                            <Text className="truncate">{`${(noteMonthLengthTotal/targetNoteMonthLength)*100}% (${Number(noteMonthLengthTotal).toLocaleString('en')})`}</Text>
                            <Text>{Number(targetNoteMonthLength).toLocaleString('en')}</Text>
                        </Flex>
                        <ProgressBar percentageValue={(noteMonthLengthTotal/targetNoteMonthLength)*100} className="mt-2" />
                    </Card>
                </Grid>

                <Grid numCols={1} numColsSm={1} numColsLg={4} className="gap-6 mt-10">
                    <Col numColSpan={1} numColSpanLg={3}>
                        <Card>
                            <div className="md:flex justify-between poppins">
                                <div>
                                    <Flex
                                        justifyContent="start"
                                        className="space-x-0.5"
                                        alignItems="center"
                                    >
                                        <Title className='font-semibold'> Riwayat Omzet Toko Sembako Djuju </Title>
                                        <Icon
                                            icon={InformationCircleIcon}
                                            variant="simple"
                                            tooltip="Menampilkan perubahan setiap bulan dari omzet sebelumnya"
                                        />
                                    </Flex>
                                    <Text> Kenaikan atau penurunan setiap bulan per domain</Text>
                                </div>
                            </div>
                            <AreaChart
                                data={
                                    omzet?.map(data => ({
                                        month: moment(data?.omzet_time).format('MMM YYYY'),
                                        value: data?.omzet_amount
                                    }))
                                }
                                index="month"
                                yAxisWidth={73}
                                colors={["blue"]}
                                showLegend={false}
                                categories={["value"]}
                                valueFormatter={formatedCurrency}
                                className="h-96 mt-8 poppins"
                            />
                        </Card>
                    </Col>
                    <Card>
                        <div>
                            <Title className='poppins font-semibold'>Traffic Satuan Barang</Title>
                            <List className='mt-6'>
                                {
                                    notes
                                    ?.reduce((accumulator, currentValue) => {
                                        const { product, purchase_amount } = currentValue;
                                        const { unit } = product;
                                        
                                        if (!accumulator[unit]) {
                                            accumulator[unit] = 0;
                                        }
                                    
                                        accumulator[unit] += purchase_amount;
                                        
                                        return accumulator;
                                    }, {})
                                    && Object.keys(notes?.reduce((accumulator, currentValue) => {
                                        const { product, purchase_amount } = currentValue;
                                        const { unit } = product;
                                        
                                        if (!accumulator[unit]) {
                                            accumulator[unit] = 0;
                                        }
                                        
                                        accumulator[unit] += purchase_amount;
                                        
                                        return accumulator;
                                    }, {}))
                                    ?.map((unit, index) => {
                                        const totalQuantity = notes?.reduce((accumulator, currentValue) => {
                                            const { product, purchase_amount } = currentValue;
                                            const { unit: productUnit } = product;
                                            
                                            if (unit === productUnit) {
                                                accumulator += purchase_amount;
                                            }
                                        return accumulator;
                                    }, 0);
                                
                                    return (
                                        <ListItem key={index}>
                                            <div className='w-full'>
                                                <div className="flex items-center justify-between w-full text-[0.90rem]  text-neutral-900">
                                                    <h1 className="poppins">{
                                                        unit === 'pcs' ?
                                                        'Piece'
                                                        :
                                                        unit === 'kotak' ?
                                                        'Box'
                                                        :
                                                        'Kilogram'
                                                    }</h1>
                                                    <h1 className="poppins">{notes ? totalQuantity.toLocaleString() : 0}</h1>
                                                </div>
                                                <ProgressBar
                                                    className='mt-2'
                                                    percentageValue={totalQuantity * 100 / (notes.reduce((accumulator, currentValue) => {
                                                        const { product, purchase_amount } = currentValue;
                                                        const { unit: productUnit } = product;
                                                        
                                                        if (unit === productUnit) {
                                                        accumulator += purchase_amount;
                                                        }
                                                        
                                                        return accumulator;
                                                    }, 0) * 1.25)}
                                                />
                                            </div>
                                        </ListItem>
                                    )
                                })}
                            </List>
                        </div>
                        {
                            auth?.user?.role === 'owner' &&
                            <div className='mt-5'>
                                <Title className='poppins font-semibold'>Profit Bulan ini</Title>
                                <Metric className="truncate poppins mt-3 underline">{formatedCurrency(modalThisMonth)}</Metric>
                            </div>
                        }
                    </Card>
                </Grid>
            </div>
        </div>
    )
}

Dashboard.layout = page => (
    <AdminLayout title='Dashboard - Admin Toko Sembako Djuju' keyword='dashboard djuju, dashboard toko sembako djuju' desc='Dashboard untuk mengelola toko sembako djuju' >
        <DashboardLayout children={page} pageName="Dashboard" />
    </AdminLayout>
)