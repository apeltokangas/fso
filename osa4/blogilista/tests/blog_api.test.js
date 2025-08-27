const { test, before, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  }
]

before(async () => {
    await mongoose.connect(process.env.MONGODB_URI)
})

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

describe('GET /api/blogs', () => {
  test.only('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  })

  test.only('returns the right amount of blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test.only('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body[0].id, initialBlogs[0]._id)
  })
})

describe('POST /api/blogs', () => {
  test.only('a valid blog can be added and the amount encreases', async () => {
    const newBlog = {
      title: "Moro",
      author: "Joku",
      url: "urli",
      likes: 12
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length + 1)
    })
    test.only('if likes is not given a value, it defaults to 0', async () => {
    const newBlog = {
      title: "Moro",
      author: "Joku",
      url: "urli",
      likes: ""
    }
    const response = await api.post('/api/blogs').send(newBlog)
    assert.strictEqual(response.body.likes, 0)
  })

  test.only('if title or url is missing, it returns 400', async () => {
    const newBlog = {
      author: "Joku",
      url: "urli",
      likes: 12
    }
    const response = await api.post('/api/blogs').send(newBlog)
    assert.strictEqual(response.status, 400)
    const newBlog2 = {
      title: "Moro",
      author: "Joku",
      likes: 12
    }
    const response2 = await api.post('/api/blogs').send(newBlog2)
    assert.strictEqual(response2.status, 400)
  })
})

describe('DELETE /api/blogs/:id', () => {
  test.only('a blog can be deleted', async () => {
    const response = await api.get('/api/blogs')
    const blogToDelete = response.body[0]
    await api.delete(`/api/blogs/${blogToDelete.id}`)
    const response2 = await api.get('/api/blogs')
    assert.strictEqual(response2.body.length, initialBlogs.length - 1)
  })

  test.only('returns 204 if blog is deleted', async () => {
    const response = await api.get('/api/blogs')
    const blogToDelete = response.body[0]
    const response2 = await api.delete(`/api/blogs/${blogToDelete.id}`)
    assert.strictEqual(response2.status, 204)
  })

  test.only('returns 400 if blog is not found', async () => {
    const response = await api.delete('/api/blogs/9238750935')
    assert.strictEqual(response.status, 400)
  })

  test.only('id cannot be found after deletion', async () => {
    const response = await api.get('/api/blogs')
    const blogToDelete = response.body[0]
    await api.delete(`/api/blogs/${blogToDelete.id}`)
    const response2 = await api.get('/api/blogs')
    assert.ok(!response2.body.find(blog => blog.id === blogToDelete.id))
  })
})

describe('PUT /api/blogs/:id', () => {
  test.only('a blog can be updated and gets updated as expected', async () => {
    const response = await api.get('/api/blogs')
    const blogToUpdate = response.body[0]
    const updatedBlog = {
      title: "Moro",
      author: "Joku",
      url: "urli",
      likes: 12
    }
    await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog)
    const response2 = await api.get('/api/blogs')
    assert.strictEqual(response2.body[0].likes, updatedBlog.likes)
    assert.strictEqual(response2.body[0].title, updatedBlog.title)
    assert.strictEqual(response2.body[0].url, updatedBlog.url)
    assert.strictEqual(response2.body[0].author, updatedBlog.author)
  })

  test.only('if likes is not given a value, it defaults to 0', async () => {
    const response = await api.get('/api/blogs')
    const blogToUpdate = response.body[0]
    const updatedBlog = {
      title: "Moro",
      author: "Joku",
      url: "urli",
      likes: ""
    }
    await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog)
    const response2 = await api.get('/api/blogs')
    assert.strictEqual(response2.body[0].likes, 0)
  })

  test.only('works even if only what needs to be updated is given', async () => {
    const response = await api.get('/api/blogs')
    const blogToUpdate = response.body[0]
    const updatedBlog = {
      author: "Joku",
      url: "urli",
      likes: 12
    }
    const response2 = await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog)
    assert.strictEqual(response2.status, 200)
    const updatedBlog2 = {
      likes: 9358730895
    }
    const response3 = await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog2)
    assert.strictEqual(response3.status, 200)
  })

  test.only('returns 400 if blog is not found', async () => {
    const response = await api.put('/api/blogs/9238750935')
    assert.strictEqual(response.status, 400)
  })
})

after(async () => {
  await mongoose.connection.close()
})