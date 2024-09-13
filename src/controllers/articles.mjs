import {getArticleById, getArticles} from "../services/articleService.mjs";

const getArticlesHandler = (req, res) => {
    const articles = getArticles()
    res.render('articles/index', { articles })
}
const postArticlesHandler = (req, res) => {
    res.send('GET Users route')}

// Articles by id
const getArticleByIdHandler = (req, res) => {
    const articleId = req.params['articleId']
    const article = getArticleById(articleId)
    res.render('articles/article', { article })
}
const deleteArticleByIdHandler = (req, res) => {
    const {ArticleId} = req.params
    res.send(`DELETE Users by id route with id: ${ArticleId}`)
}
const putArticleByIdHandler = (req, res) => {
    const {ArticleId} = req.params
    res.send(`PUT Users by id route with id: ${ArticleId}`)
}

export {
    getArticlesHandler,
    postArticlesHandler,
    getArticleByIdHandler,
    deleteArticleByIdHandler,
    putArticleByIdHandler
}