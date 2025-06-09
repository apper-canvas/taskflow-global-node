import React from 'react';

const Button = ({ onClick, children, className, type = 'button' }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`transition duration-300 ease-in-out ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;