import { Router } from 'express'
import {deleteUserByIdHandler, getUserByIdHandler, getUsersHandler, postUsersHandler, putUserByIdHandler} from '../controllers/users.mjs'
import { validateUserPost, validateUserPut, validateParamsUserId } from '../validators/userValidation.mjs'

const usersRouter = Router()

usersRouter.route('/')
    .get(getUsersHandler)
    .post(validateUserPost, postUsersHandler)

usersRouter.route('/:userId')
    .get(validateParamsUserId, getUserByIdHandler)
    .delete(validateParamsUserId, deleteUserByIdHandler)
    .put(validateParamsUserId, validateUserPut, putUserByIdHandler)

export default usersRouter