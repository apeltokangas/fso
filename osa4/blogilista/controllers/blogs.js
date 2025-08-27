const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const blog = new Blog(req.body)
  if (req.body.likes === "") {
    blog.likes = 0
  }
  if (!blog.title || !blog.url) {
    return res.status(400).json({ error: 'title or url missing' })
  }
  const saved = await blog.save()
  res.status(201).json(saved)
})

blogsRouter.delete('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
      return res.status(404).json({ error: 'id missing' })
    } else {
        await Blog.findByIdAndDelete(req.params.id)
        res.status(204).end()
    }
})

blogsRouter.put('/:id', async (req, res) => {
  const blogInQuestion = await Blog.findById(req.params.id)
  if (!blogInQuestion) {
    return res.status(404).json({ error: 'id missing' })
  }
  const blog = {
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes
  }
  if (blog.likes === "") {
    blog.likes = 0
  }
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
  res.json(updatedBlog)
})

module.exports = blogsRouter
