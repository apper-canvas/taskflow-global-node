import React from 'react';

const Input = ({ type = 'text', className, ...props }) => {
    const inputClasses = `mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${className}`;

    if (type === 'textarea') {
        return (
            <textarea
                className={inputClasses}
                rows="4"
                {...props}
            ></textarea>
        );
    }

    return (
        <input
            type={type}
            className={inputClasses}
            {...props}
        />
    );
};

export default Input;