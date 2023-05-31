import { Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import React, { useEffect, useRef, useState, useCallback } from "react";

import '../../../../scss/admin/report/_reportperiod.scss';

import DashboardLayout from '../DashboardLayout';

export default function ReportPeriodDash() {

    return (
        <div className="report-period-component">
            <div id="container_report_period">
                <div className="period-type-wrapper mt-10 flex xs:flex-col gap-6 xs:gap-y-8">
                    <div id='week' className="periode-card shadow-own flex-1 montserrat p-3 flex flex-col items-center gap-6">
                        <h1 className="font-semibold text-center mt-2 uppercase">Periode Mingguan</h1>
                        <Link href="/sales-note/report-period/week" classID='w-full'>
                            <button className="mb-3 bg-blue-600 p-2 rounded-[5px] text-white xs:w-full">
                                Cek dan Lihat Laporan
                            </button>
                        </Link>
                    </div>
                    <div id='month' className="periode-card shadow-own flex-1 montserrat p-3 flex flex-col items-center gap-6">
                        <h1 className="font-semibold text-center mt-2 uppercase">Periode Bulanan</h1>
                        <Link href="/sales-note/report-period/month">
                            <button className="mb-3 bg-indigo-600 p-2 rounded-[5px] text-white xs:w-full">
                                Cek dan Lihat Laporan
                            </button>
                        </Link>
                    </div>
                    <div id='year' className="periode-card shadow-own flex-1 montserrat p-3 flex flex-col items-center gap-6">
                        <h1 className="font-semibold text-center mt-2 uppercase">Periode Tahunan</h1>
                        <Link href="/sales-note/report-period/year">
                            <button className="mb-3 bg-green-600 p-2 rounded-[5px] text-white xs:w-full">
                                Cek dan Lihat Laporan
                            </button>
                        </Link>
                    </div>
                    <div id='between' className="periode-card shadow-own flex-1 montserrat p-3 flex flex-col items-center gap-6">
                        <h1 className="font-semibold text-center mt-2 uppercase">Periode Range Date</h1>
                        <Link href="/sales-note/report-period/range">
                            <button className="mb-3 bg-yellow-600 p-2 rounded-[5px] text-white xs:w-full">
                                Cek dan Lihat Laporan
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

ReportPeriodDash.layout = page => (
    <AdminLayout title='Periode Laporan - Admin Toko Sembako Djuju' keyword='periode laporan dashboard toko sembako djuju' desc='Halaman untuk memilih periode laporan pada toko sembako Djuju' >
        <DashboardLayout children={page} pageName="Peirode Laporan Penjualan" />
    </AdminLayout>
)