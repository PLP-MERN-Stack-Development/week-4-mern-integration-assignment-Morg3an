// src/pages/MyPosts.jsx
import { useEffect, useState, useContext } from 'react';
import { postService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import PostCard from '../components/PostCard';

const MyPosts = () => {
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyPosts = async () => {
            try {
                const all = await postService.getAllPosts();
                const mine = all.filter((post) => post.author._id === user.id);
                setPosts(mine);
            } catch (error) {
                console.error('Failed to fetch user posts:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchMyPosts();
        }
    }, [user]);

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">My Posts</h1>
            {loading ? (
                <p>Loading...</p>
            ) : posts.length === 0 ? (
                <p>You haven’t created any posts yet.</p>
            ) : (
                <div className="grid gap-4">
                    {posts.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPosts;
