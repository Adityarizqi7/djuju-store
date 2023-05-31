import { useState, useEffect } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function ErrorAlert({ msg_primary, msg_detail, className, time=3000}) {

	const [show, setShow] = useState(true)
	
	setTimeout(() => {
		setShow(false);
	}, time);

	useEffect(() => {
		return () => clearTimeout(show);
	}, []);

	return (
	<>
		{show && (
		<div className={`${className} ${show === false ? 'hide' : ''} poppins bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center justify-between`} role="alert">
			<div className="text">
				<strong className="font-bold">{msg_primary}</strong>
				<span className="block sm:inline">{msg_detail}</span>
			</div>
			<XMarkIcon className="w-5 h-5" />
		</div>
		)}
	</>
	);
}