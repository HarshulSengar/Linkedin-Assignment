import React, { useState } from 'react';

function PostForm({ fetchPosts, token }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:5000/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ text }),
    })
      .then((res) => res.json())
      .then(() => {
        setText('');
        fetchPosts();
      });
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's on your mind?"
        required
      />
      <button type="submit">Post</button>
    </form>
  );
}

export default PostForm;
