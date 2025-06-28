import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <div className="bg-white p-8 rounded shadow-lg text-center w-full max-w-lg">
                <h1 className="text-2xl font-bold mb-4">
                    Welcome{user ? `, ${user.name}` : ''} 👋
                </h1>

                {!user ? (
                    <>
                        <p className="mb-6 text-gray-600">Please login or register to continue.</p>
                        <div className="flex justify-center gap-4">
                            <Link
                                to="/login"
                                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
                            >
                                Register
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="mb-6 text-gray-600">What would you like to do?</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                to="/posts"
                                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
                            >
                                View All Posts
                            </Link>
                            <Link
                                to="/my-posts"
                                className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
                            >
                                My Posts
                            </Link>
                            <Link
                                to="/create"
                                className="bg-purple-600 text-white px-5 py-2 rounded hover:bg-purple-700 transition"
                            >
                                Create Post
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;