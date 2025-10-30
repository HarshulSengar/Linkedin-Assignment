import React, { useState } from 'react';

function PostCard({ post, fetchPosts, user, token }) {
  const [edit, setEdit] = useState(false);
  const [text, setText] = useState(post.text);

  const likePost = () => {
    fetch(`http://localhost:5000/api/posts/${post._id}/like`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    }).then(fetchPosts);
  };

  const deletePost = () => {
    fetch(`http://localhost:5000/api/posts/${post._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }).then(fetchPosts);
  };

  const editPost = () => {
    fetch(`http://localhost:5000/api/posts/${post._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ text }),
    }).then(() => {
      setEdit(false);
      fetchPosts();
    });
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <span className="avatar">
          {post.author.name[0]?.toUpperCase()}
        </span>
        <div>
          <strong>{post.author.name}</strong>
          <div style={{ fontSize: '0.89em', color: '#888' }}>{new Date(post.createdAt).toLocaleString()}</div>
        </div>
      </div>
      <div className="post-content">
        {edit
          ? <textarea value={text} onChange={e => setText(e.target.value)} />
          : <p>{post.text}</p>}
      </div>
      <div className="post-actions">
        <button onClick={likePost}>Like ({post.likes.length})</button>
        {post.author._id === user.id && (
          <>
            <button onClick={() => setEdit((e) => !e)}>{edit ? 'Cancel' : 'Edit'}</button>
            <button onClick={deletePost}>Delete</button>
            {edit && <button onClick={editPost}>Save</button>}
          </>
        )}
      </div>
    </div>
  );
}

export default PostCard;
