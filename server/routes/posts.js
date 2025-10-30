const express = require('express');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');

const router = express.Router();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.userId = decoded.id;
    next();
  });
};

router.post('/', authMiddleware, async (req, res) => {
  try {
    const post = new Post({
      author: req.userId,
      text: req.body.text,
    });
    await post.save();
    const populated = await post.populate('author', 'name');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id/like', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const userIndex = post.likes.indexOf(req.userId);
    if (userIndex === -1) post.likes.push(req.userId);
    else post.likes.splice(userIndex, 1);

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.author.toString() !== req.userId) return res.status(403).json({ error: 'Forbidden' });

    post.text = req.body.text;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author.toString() !== req.userId) return res.status(403).json({ error: 'Forbidden' });

    await post.deleteOne();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/comment', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    post.comments.push({ user: req.userId, text: req.body.text });
    await post.save();
    await post.populate('comments.user', 'name');
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
