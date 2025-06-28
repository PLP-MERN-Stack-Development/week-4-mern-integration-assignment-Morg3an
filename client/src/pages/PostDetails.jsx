import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService } from '../services/api';
import { BASE_URL } from '../services/config';
import { AuthContext } from '../context/AuthContext';

const PostDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [post, setPost] = useState(null);
    const [error, setError] = useState('');
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchPost = async () => {
        try {
            const data = await postService.getPost(id);
            setPost(data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch post');
        }
    };

    useEffect(() => {
        fetchPost();
    }, [id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setSubmitting(true);
        try {
            await postService.addComment(post._id, { content: commentText });
            setCommentText('');
            await fetchPost(); // Refresh post to show new comment
        } catch (err) {
            alert('Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        try {
            await postService.deletePost(post._id);
            navigate('/posts');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete post');
        }
    };

    if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;
    if (!post) return <p className="text-center mt-8">Loading...</p>;

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <p className="text-sm text-gray-500 mb-4">
                By {post.author?.name || 'Unknown'} | {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-500 mb-4 italic">
                Status: {post.isPublished ? 'Published' : 'Draft'}
            </p>


            {/* Edit/Delete Buttons (Author Only) */}
            {user?._id === post.author?._id && (
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => navigate(`/posts/${post._id}/edit`)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                        Delete
                    </button>
                </div>
            )}

            {/* Featured Image */}
            {post.featuredImage && (
                <img
                    src={`${BASE_URL}${post.featuredImage}`}
                    alt={post.title}
                    className="w-full h-auto rounded mb-6"
                />
            )}

            <p className="text-gray-800 mb-6 whitespace-pre-line">{post.content}</p>

            {/* Comment Form */}
            {user && (
                <form onSubmit={handleCommentSubmit} className="mt-6 space-y-2">
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full border p-2 rounded"
                        placeholder="Write a comment..."
                        rows={3}
                        required
                    />
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        {submitting ? 'Posting...' : 'Post Comment'}
                    </button>
                </form>
            )}

            {/* Comments Section */}
            {post.comments?.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">Comments</h2>
                    <ul className="space-y-2">
                        {post.comments.map((c, i) => (
                            <li key={i} className="border p-2 rounded">
                                <p className="text-sm">{c.content}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(c.createdAt).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PostDetails;