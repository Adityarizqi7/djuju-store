import * as path from 'path'
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/js/app.jsx',
                'resources/scss/base.scss',
                'resources/scss/admin/_signin.scss',
                'resources/scss/admin/_dashboard.scss',
                'resources/scss/admin/component/_btntotop',
                'resources/scss/admin/product/_note.scss',
                'resources/scss/admin/product/_report.scss',
                'resources/scss/admin/product/_product.scss',
                'resources/scss/admin/product/_showproduct.scss',
                'resources/scss/admin/product/_createproduct.scss',
                'resources/scss/admin/product/_reportyaer.scss',
                'resources/scss/admin/product/_reportweek.scss',
                'resources/scss/admin/product/_reportmonth.scss',
                'resources/scss/admin/product/_reportrange.scss',
                'resources/scss/admin/product/_reportperiod.scss',
                'resources/scss/admin/modal/_asset.scss',
                'resources/scss/admin/modal/_showasset.scss',
                'resources/scss/admin/omzet/_omzet.scss',
                'resources/scss/admin/omzet/_omzet.scss',
                'resources/scss/admin/omzet/_predictomzet.scss',
                'resources/scss/admin/omzet/_showomzet.scss',
                'resources/scss/admin/profit/_profit.scss',
                'resources/scss/admin/profit/_predictprofit.scss',
                'resources/scss/admin/profit/_showprofit.scss',
                'resources/scss/admin/user/_user.scss',
                'resources/scss/admin/user/_registration.scss',
                'resources/scss/admin/user/_showuser.scss',
            ],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
});
