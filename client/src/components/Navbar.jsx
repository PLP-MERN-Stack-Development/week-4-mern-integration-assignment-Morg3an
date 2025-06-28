import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
                Blog App
            </Link>
            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <Link to="/" className="text-gray-700 hover:text-blue-600">
                            Dashboard
                        </Link>
                        <Link to="/posts" className="text-gray-700 hover:text-blue-600">
                            All Posts
                        </Link>
                        <Link to="/my-posts" className="text-gray-700 hover:text-blue-600">
                            My Posts
                        </Link>
                        <button
                            onClick={logout}
                            className="text-red-600 hover:text-red-800 font-medium"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-700 hover:text-blue-600">
                            Login
                        </Link>
                        <Link to="/register" className="text-gray-700 hover:text-blue-600">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;