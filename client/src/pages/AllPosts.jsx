import { useEffect, useState } from 'react';
import { postService, categoryService } from '../services/api';
import PostCard from '../components/PostCard';

const AllPosts = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [status, setStatus] = useState(''); // new status state

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await categoryService.getAllCategories();
            setCategories(data);
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const data = await postService.getAllPosts(page, 6, category, search, status);
                setPosts(data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch posts');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [page, category, search, status]);

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">All Posts</h1>

            <input
                type="text"
                placeholder="Search posts..."
                className="w-full border px-4 py-2 mb-4 rounded"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <select
                className="w-full border px-4 py-2 mb-4 rounded"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
            </select>

            {/* Publish status filter */}
            <select
                className="w-full border px-4 py-2 mb-4 rounded"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            >
                <option value="">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
            </select>

            {error && <p className="text-red-500">{error}</p>}

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
                <span className="py-2 px-4">{page}</span>
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