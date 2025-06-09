import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
            <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
            <p className="text-2xl mb-8">Page Not Found</p>
            <Link to="/" className="px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-opacity-90 transition duration-300">
                Go to Home
            </Link>
        </div>
    );
};

export default NotFoundPage;