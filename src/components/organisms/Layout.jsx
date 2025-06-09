import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ApperIcon } from '@/components/ApperIcon';

const Layout = () => {
    return (
        <>
            <header className="bg-primary text-white p-4 shadow-md flex justify-between items-center z-10">
                <Link to="/" className="text-xl font-bold flex items-center gap-2">
                    <ApperIcon name="logo" className="w-7 h-7" />
                    My App
                </Link>
                <nav>
                    {/* Navigation items can go here if needed later */}
                </nav>
            </header>
            <main className="flex-1 overflow-hidden">
                <Outlet />
            </main>
            <footer className="bg-gray-800 text-white p-4 text-center text-sm shadow-md z-10">
                © {new Date().getFullYear()} My App. All rights reserved.
            </footer>
        </>
    );
};

export default Layout;