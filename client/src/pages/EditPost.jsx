import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postService, categoryService } from '../services/api';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: '',
        content: '',
        category: '',
        tags: '',
        isPublished: false,
    });
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPostAndCategories = async () => {
            try {
                const [postData, categoryData] = await Promise.all([
                    postService.getPost(id),
                    categoryService.getAllCategories(),
                ]);

                setForm({
                    title: postData.title,
                    content: postData.content,
                    category: postData.category?._id || '',
                    tags: postData.tags?.join(', ') || '',
                    isPublished: postData.isPublished || false,
                });

                setCategories(categoryData);
            } catch (err) {
                setError('Failed to load post or categories');
            }
        };

        fetchPostAndCategories();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('content', form.content);
            formData.append('category', form.category);
            formData.append(
                'tags',
                JSON.stringify(form.tags.split(',').map((tag) => tag.trim()))
            );
            formData.append('isPublished', form.isPublished); // ✅ Append publish status

            if (image) {
                formData.append('featuredImage', image);
            }

            await postService.updatePost(id, formData);
            navigate(`/posts/${id}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update post');
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
            {error && <p className="text-red-500">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                />

                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="w-full border p-2 rounded"
                />

                <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    placeholder="Content"
                    className="w-full border p-2 rounded"
                    rows={6}
                />

                <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
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
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="Tags (comma separated)"
                    className="w-full border p-2 rounded"
                />

                {/* Publish toggle */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isPublished"
                        checked={form.isPublished}
                        onChange={() =>
                            setForm((prev) => ({
                                ...prev,
                                isPublished: !prev.isPublished,
                            }))
                        }
                        className="mr-2"
                    />
                    <label htmlFor="isPublished" className="text-sm">
                        Publish this post
                    </label>
                </div>

                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    Update Post
                </button>
            </form>
        </div>
    );
};

export default EditPost;