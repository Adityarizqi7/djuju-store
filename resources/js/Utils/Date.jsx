import moment from 'moment';
import { format, addDays } from 'date-fns';
import id from 'date-fns/locale/id';

const date = new Date();
const yesterday = new Date(date);
const time = date.toLocaleTimeString('id-ID');
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const formattedDate = date.toLocaleDateString('id-ID', options);

export let startDateFormatted = ''
export let endDateFormatted = ''

export const dateNow = () => {
    return date
}

export const CurrentYear = () => {
    return date.getFullYear()
}

export const now = () => {
    return formattedDate
}

export const timeNow = () => {
    return time
}

export const dateYMD = () => {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // Date Sekarang (2023-03-24)
    return formattedDate
}

export const dayYesterdayYMD = () => {

    const yesterday = moment().subtract(1, 'day'); // mengurangi 1 bulan dari bulan saat ini
    const formattedDayYesterday = yesterday.format('YYYY-MM-DD');

    // Date Kemarin (2023-03-24)
    return formattedDayYesterday
}

export const convertDateReadble = (date) => {
    // 2023-03-21 -> Selasa, 21 Maret 2023
    return format(addDays(new Date(date), 0), 'eeee, d MMMM yyyy', { locale: id });
}

export const weekYW = () => {
    const now = moment();
    const thisWeek = now.isoWeek();
    const thisYear = now.year();
    
    // Minggu Sekarang (2023-w12)
    return `${thisYear}-W${thisWeek}`;
}

export const convertWeekReadble = (weekParam) => {

    const year = weekParam.substr(0, 4);
    const week = weekParam.substr(6, 2);

    const startDate = moment().isoWeekYear(year).isoWeek(week).startOf('isoWeek').format('YYYY-MM-DD');
    const endDate = moment().isoWeekYear(year).isoWeek(week).endOf('isoWeek').format('YYYY-MM-DD');

    // 2023-03-24 / 2023-03-30
    startDateFormatted = startDate;
    endDateFormatted = endDate;
    return `${convertDateReadble(startDate)} / ${convertDateReadble(endDate)}`;
}

export const monthYM = () => {
    // 2023-03
    return moment().format('YYYY-MM');
}

export const monthYesterdayYMD = () => {

    const yesterday = moment().subtract(1, 'month'); // mengurangi 1 bulan dari bulan saat ini
    const formattedMonthYesterday = yesterday.format('YYYY-MM-DD');

    // Date Kemarin (2023-03-24)
    return formattedMonthYesterday
}

export const convertMonthReadble = (month) => {
        
    const monthName = moment(month + '-01').format('MMMM');
    const year = moment(month + '-01').format('YYYY');

    // March 2023
    return `${monthName} ${year}`;
}

export const yearY = () => {
    // 2023
    return moment().format('YYYY');
}

export const convertYearReadble = (month) => {
        
    const year = moment(month + '-01').format('YYYY');

    // 2023
    return `${year}`;
}

export const rangeDateSplit = (date) => {
    // SAT MAR 25 2023 09:48:30 GMT+0700 (WESTERN INDONESIA TIME) -> SAT MAR 25 2023
    return moment(date, "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ").format("ddd MMM DD YYYY");
}

export const rangeDateYMD = (date) => {
    // SAT MAR 25 2023 -> 2023-03-25
    return moment(date, "ddd MMM DD YYYY").format("YYYY-MM-DD");
}

export const rangeDateYM = (date) => {
    // SAT MAR 25 2023 -> 2023-03-25
    return moment(date, "ddd MMM DD YYYY").format("YYYY-MM");
}

export const rangeDateReadble = (date) => {
    // SAT MAR 25 2023 -> Sabtu, 25 Maret 2023
    return moment(date, 'ddd MMM DD YYYY').locale('id').format('dddd, D MMMM YYYY');
}

export const oneMonthBefore = () => {
    let year = date.getFullYear()
    let month = date.getMonth()
    if (month === 0) {
        year--;
        month = 11;
    } else {
        month--;
    }

    // jika bulan saat ini januari (0), bulan sebelumnya adalah desember (11)
    return `${year}-${(month + 1).toString().padStart(2, "0")}`;
}