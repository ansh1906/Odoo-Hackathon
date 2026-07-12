import React from 'react'
import { useNavigate } from 'react-router-dom';
import {logout} from '../api/auth'
function Navbar() {
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.log("Logout failed:", error);
        }

    };
    return (
        <nav className="w-full h-17 flex items-center px-6 border-b border-gray-500 bg-mist-200 dark:bg-gray-900">
            <h1 className="text-2xl font-bold text-black dark:text-white">
                AssetFlow
            </h1>
            <button onClick={handleLogout} className="ml-auto px-4 py-2 rounded bg-red-500 text-white">Logout</button>
        </nav>
    )
}

export default Navbar
