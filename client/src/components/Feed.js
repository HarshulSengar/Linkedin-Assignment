import React, { useEffect, useState } from 'react';
import PostForm from './PostForm';
import PostCard from './PostCard';

const API = 'http://localhost:5000/api/posts';

function Feed({ user, token }) {
  const [posts, setPosts] = useState([]);
  const fetchPosts = () => {
    fetch(API, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json()).then(setPosts).catch(() => setPosts([]));
  };
  useEffect(() => { fetchPosts(); }, []);
  return (
    <>
      <PostForm fetchPosts={fetchPosts} token={token} />
      {posts.map(post =>
        <PostCard key={post._id} post={post} fetchPosts={fetchPosts} user={user} token={token} />
      )}
    </>
  );
}
export default Feed;
