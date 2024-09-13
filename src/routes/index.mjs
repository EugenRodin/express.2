import { Router } from 'express'
import rootHandler from './root.mjs'
import usersRouter from './users.mjs'
import articlesRouter from './articles.mjs'

const router = Router()

router.use('/', rootHandler)
router.use('/users', usersRouter)
router.use('/articles', articlesRouter)
router.get('/', (req, res) => {
    res.send('Hello World!')
})

export default router