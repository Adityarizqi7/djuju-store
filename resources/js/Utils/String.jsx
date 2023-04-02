export const randomString = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const randomChars = Array.from({length: 6}, () => characters.charAt(Math.floor(Math.random() * characters.length)));
    return randomChars.join('');
}

export const randomStringThree = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const randomChars = Array.from({length: 3}, () => characters.charAt(Math.floor(Math.random() * characters.length)));
    return randomChars.join('');
}

export const randomStringCustom = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const randomChars = Array.from({length: length}, () => characters.charAt(Math.floor(Math.random() * characters.length)));
    return randomChars.join('');
}

export const randomNumber = () => {
    const characters = '0123456789';
    const randomChars = Array.from({length: 6}, () => characters.charAt(Math.floor(Math.random() * characters.length)));
    return randomChars.join('');
}

export const formatedCurrency = (number) => {
    return number.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }).replace(',00', '');
}

export const limitString = (string, maxLength) => {
    if (string.length > maxLength) return string.substring(0, maxLength) + "...";
    return string;
}  