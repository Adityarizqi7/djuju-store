import RequireStar from "./RequireStar";

export default function InputLabel({ value, classStar, className = 'text-sm', children, ...props }) {
    return (
        <>
            <label {...props} className={`block font-medium poppins text-gray-700 dark:text-gray-300 ` + className}>
                {value ? value : children}
                <RequireStar classStar={'ml-1 ' + classStar}  />
            </label>
        </>
    );
}
