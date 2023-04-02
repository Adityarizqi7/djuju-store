const defaultTheme = require('tailwindcss/defaultTheme');
const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        './node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}',
        './node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}',
        './node_modules/@tremor/**/*.{js,ts,jsx,tsx}',
    ],

    theme: {
        extend: {
            colors: {
                'blue-base': '#4154be',
                'second-base': '#f9004d',
                'error-color': '#B8351C',
                'indigo-low': '#f1f1ff',
                'dark-theme': '#1E1E2C',
            },
            screens: {
                '9xs': { max: '120px' },
                '8xs': { max: '145px' },
                '7xs': { max: '195px' },
                '6xs': { max: '240px' },
                '5xs': { max: '320px' },
                '4xs': { max: '375px' },
                '3xs': { max: '411px' },
                '2xs': { max: '480px' },
                xs: { max: '540px' },
                xxs: { max: '639px' },
            },
            aspectRatio: {
                '3/2': '3 / 2',
            },
        },
    },
    plugins: [require('@tailwindcss/forms'), require('@headlessui/tailwindcss')({ prefix: 'ui' })],
};
