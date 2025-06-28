import { useState, useEffect } from 'react';
import { postService, categoryService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const [form, setForm] = useState({ title: '', content: '', category: '', tags: '' });
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAllCategories();
                setCategories(data);
            } catch (err) {
                setError('Failed to load categories');
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('content', form.content);
            formData.append('category', form.category);
            formData.append('tags', JSON.stringify(form.tags.split(',').map((tag) => tag.trim())));
            if (image) {
                formData.append('featuredImage', image);
            }
            await postService.createPost(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create post');
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
            {error && <p className="text-red-500">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="file"
                    name="featuredImage"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                />
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    className="w-full border p-2 rounded"
                    value={form.title}
                    onChange={handleChange}
                />
                <textarea
                    name="content"
                    placeholder="Content"
                    className="w-full border p-2 rounded"
                    rows="6"
                    value={form.content}
                    onChange={handleChange}
                />
                <select
                    name="category"
                    className="w-full border p-2 rounded"
                    value={form.category}
                    onChange={handleChange}
                >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    name="tags"
                    placeholder="Tags (comma separated)"
                    className="w-full border p-2 rounded"
                    value={form.tags}
                    onChange={handleChange}
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Create Post
                </button>
            </form>
        </div>
    );
};

export default CreatePost;