const articles = [
    { id: 1, title: 'First Article', content: 'Content of the first article' },
    { id: 2, title: 'Second Article', content: 'Content of the second article' }
]

const getArticles = () => articles

const getArticleById = (id) => articles.find(article => article.id === parseInt(id))

export { getArticles, getArticleById }