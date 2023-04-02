import { Link } from "@inertiajs/react";

export default function BtnPrimary({ title, link, className, ...props }) {
    return (
        <Link {...props} href={link} className={`${className} py-3 px-[1.10rem] rounded-[5px] montserrat transition-colors duration-300 bg-blue-700 text-white`}>
            {title}
        </Link>
    )
}