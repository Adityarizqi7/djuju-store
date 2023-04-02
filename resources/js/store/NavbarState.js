export const navbarState = [
    {
        id: 1,
        name: "Dashboard",
        link: "/dashboard",
        access: ['owner', 'employee']
    },
    {
        id: 2,
        name: "Barang",
        link: "/product",
        access: ['owner', 'employee']
    },
    {
        id: 3,
        name: "Catatan Penjualan",
        link: true,
        access: ['owner', 'employee'],
        child: [
            {
                id: 3.1,
                name: "Catatan Transaksi",
                link: "/sales-note/transaction",
                access: ['owner', 'employee']
            },
            {
                id: 3.2,
                name: "Laporan Harian",
                link: "/sales-note/daily-report",
                access: ['owner', 'employee']
            },
            {
                id: 3.3,
                name: "Periode Laporan",
                link: "/sales-note/report-period",
                access: ['owner']
            }
        ]
    },
    {
        id: 4,
        name: "Modal",
        link: "/asset",
        access: ['owner', 'employee']
    },
    {
        id: 5,
        name: "Omzet",
        link: "/omzet",
        access: ['owner']
    },
    {
        id: 6,
        name: "Profit",
        link: "/profit",
        access: ['owner']
    },
]