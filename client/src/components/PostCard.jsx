// components/PostCard.jsx
import { Link } from 'react-router-dom';
import { BASE_URL } from '../services/config';

const PostCard = ({ post }) => (
    <div className="border rounded p-4 shadow hover:shadow-lg transition">
        {post.featuredImage && (
            <img
                src={`${BASE_URL}${post.featuredImage}`}
                alt={post.title}
                className="w-full h-48 object-cover rounded mb-4"
            />
        )}
        <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
        <p className="text-sm text-gray-600 mb-2">
            By {post.author?.name || 'Unknown'} | {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <p className="text-gray-700 mb-4">{post.excerpt || post.content.slice(0, 120)}...</p>
        <Link to={`/posts/${post._id}`} className="text-blue-600 hover:underline">
            Read More →
        </Link>
    </div>
);

export default PostCard;