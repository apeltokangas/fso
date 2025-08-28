const bcrypt = require('bcrypt')
const User = require('../models/user')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const assert = require('assert')
const { test, before, after, beforeEach, describe } = require('node:test')

before(async () => {
    await mongoose.connect(process.env.MONGODB_URI)
})

const initialUsers = [
    {
        username: 'joku',
        name: 'Joku',
        password: 'password'
    },
    {
        username: 'user1',
        name: 'User 1',
        password: 'password'
    },
    {
        username: 'user2',
        name: 'User 2',
        password: 'password'
    }
]

beforeEach(async () => {
    await User.deleteMany({})
    const promiseArray = initialUsers.map(async (user) => {
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(user.password, saltRounds)
        user.passwordHash = passwordHash
        userObject = new User(user)
        await userObject.save()
    })
    
    await Promise.all(promiseArray)
})

describe('GET /api/users', () => {
    test('users are returned as json', async () => {
        await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
    test('returns the right amount of users', async () => {
        const response = await api.get('/api/users')
        assert.strictEqual(response.body.length, initialUsers.length)
    })
})

describe('POST /api/users', () => {
    test('a valid user can be added and the amount encreases', async () => {
        const newUser = {
            username: 'user3',
            name: 'User 3',
            password: 'password'
        }
        await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
        const response = await api.get('/api/users')
        assert.strictEqual(response.body.length, initialUsers.length + 1)
    })

    test('if username is missing, it returns 400', async () => {
        const newUser = {
            name: 'User 3',
            password: 'password'
        }
        const response = await api.post('/api/users').send(newUser)
        assert.strictEqual(response.status, 400)
    })

    test('if password is missing, it returns 400', async () => {
        const newUser = {
            username: 'user3',
            name: 'User 3',
        }
        const response = await api.post('/api/users').send(newUser)
        assert.strictEqual(response.status, 400)
    })

    test('if password is too short, it returns 400', async () => {
        const newUser = {
            username: 'user3',
            name: 'User 3',
            password: 'pa'
        }
        const response = await api.post('/api/users').send(newUser)
        assert.strictEqual(response.status, 400)
    })

    test('if username is too short, it returns 400', async () => {
        const newUser = {
            username: 'us',
            name: 'User 3',
            password: 'password'
        }
        const response = await api.post('/api/users').send(newUser)
        assert.strictEqual(response.status, 400)
    })

    test('if username already exists, it returns 400', async () => {
        const newUser = {
            username: 'user1',
            name: 'User 3',
            password: 'password'
        }
        const response = await api.post('/api/users').send(newUser)
        assert.strictEqual(response.status, 400)
    })
})


after(async () => {
    await mongoose.connection.close()
})