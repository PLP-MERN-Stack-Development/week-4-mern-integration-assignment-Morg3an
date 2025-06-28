import { useEffect, useState } from 'react';
import { postService, categoryService } from '../services/api';
import PostCard from '../components/PostCard';

const AllPosts = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const data = await postService.getAllPosts(page, 6, category, search);
            setPosts(data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getAllCategories();
            setCategories(data);
        } catch (err) {
            console.error('Failed to fetch categories');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [page, category, search]);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">All Posts</h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search posts..."
                    className="w-full border px-4 py-2 rounded"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                />
                <select
                    className="w-full border px-4 py-2 rounded"
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {loading && <p className="text-center">Loading posts...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                ))}
            </div>

            <div className="flex justify-center gap-4 mt-8">
                <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                    Prev
                </button>
                <span className="py-2 px-4 font-semibold">{page}</span>
                <button
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AllPosts;