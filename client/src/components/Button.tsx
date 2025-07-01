import React from 'react';


type ButtonProps = {
    onClick?: () => void;
    children: React.ReactNode;
};

function Button({ children, onClick }: ButtonProps) {
    return (
        <button
        onClick={onClick}
        className= "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
            {children}
        </button>
    );
};


export default Button;