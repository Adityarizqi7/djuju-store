import { forwardRef, useRef, useState } from 'react';

export default forwardRef(
    function TextInput({ type = 'text', className = '', isFocused = false, ...props }, ref) {
    const input = ref ? ref : useRef();

    const [focus, setFocus] = useState(false);

    return (
        <input
            {...props}
            type={type}
            className={
                'form-input montserrat border border-gray-400 border-solid rounded-[0.25rem] focus:outline ' +
                className
            }
            ref={input}
            focus={focus.toString()}
        />
    );
});
