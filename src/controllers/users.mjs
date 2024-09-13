import { getUsers, getUserById } from '../services/userService.mjs'

// users
const getUsersHandler = (req, res) => {
    const users = getUsers()
    res.render('users/index', { users })
}

const postUsersHandler = (req, res) => {
    res.end('Post users route')
}

// users/:userId
const getUserByIdHandler = (req, res) => {
    const userId = req.params['userId']
    const user = getUserById(userId)
    res.render('users/user', { user })
}

const deleteUserByIdHandler = (req, res) => {
    const userId = req.params['userId']
    res.end(`Delete user by Id route: ${userId}`)
}

const putUserByIdHandler = (req, res) => {
    const userId = req.params['userId']
    res.end(`Put user by Id route: ${userId}`)
}

export {
    getUsersHandler,
    postUsersHandler,
    getUserByIdHandler,
    deleteUserByIdHandler,
    putUserByIdHandler
}