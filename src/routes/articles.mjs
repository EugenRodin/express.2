import { Router } from 'express'
import {deleteArticleByIdHandler, getArticleByIdHandler, getArticlesHandler, postArticlesHandler, putArticleByIdHandler} from '../controllers/articles.mjs'

const articlesRouter = Router()

articlesRouter.route('/')
    .get(getArticlesHandler)
    .post(postArticlesHandler)

articlesRouter.route('/:articleId')
    .get(getArticleByIdHandler)
    .delete(deleteArticleByIdHandler)
    .put(putArticleByIdHandler)

export default articlesRouter