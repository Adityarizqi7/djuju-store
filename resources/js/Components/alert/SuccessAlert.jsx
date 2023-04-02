import { useState, useEffect } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";

export default function SuccessAlert({ msg_primary, msg_detail, className, time=3000}) {

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
		<div className={`${className} ${show === false ? 'hide' : ''} poppins bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center justify-between`} role="alert">
			<div className="text">
				<strong className="font-bold">{msg_primary}</strong>
				<span className="block sm:inline">{msg_detail}</span>
			</div>
			<CheckIcon className="w-5 h-5" />
		</div>
		)}
	</>
	);
}