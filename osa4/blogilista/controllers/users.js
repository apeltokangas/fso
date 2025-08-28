const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {title: 1, author: 1, url: 1})
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const {username, name, blogID, password} = request.body
    const blog = await Blog.findById(blogID)
    if (!username) {
        return response.status(400).json({
            error: 'username missing'
        })
    }
    if (!password) {
        return response.status(400).json({
            error: 'password missing'
        })
    }
    if (password.length < 3) {
        return response.status(400).json({
            error: 'password must be at least 3 characters long'
        })
    }
    if (username.length < 3) {
        return response.status(400).json({
            error: 'username must be at least 3 characters long'
        })
    }
    if (await User.findOne({username})) {
        return response.status(400).json({
            error: 'username must be unique'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        blogs: [blog._id],
        passwordHash
    })

    user.blogs = user.blogs.concat(blog._id)
    const savedUser = await user.save()

    response.status(201).json(savedUser)
    })

module.exports = usersRouter