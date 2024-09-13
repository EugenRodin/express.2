import { Router } from 'express'
import { getRootHandler } from '../controllers/root.mjs'

const rootHandler = Router()

rootHandler.route('/')
    .get(getRootHandler)

export default rootHandler