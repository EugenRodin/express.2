import articles from '../models/articleModel.js';

export const getArticles = (req, res) => {
  res.render('articles/index.ejs', { articles });
};

export const getArticleDetails = (req, res) => {
  const article = articles.find(a => a.id === parseInt(req.params.articleId));
  if (article) {
    res.render('articles/details.ejs', { article });
  } else {
    res.status(404).send('Стаття не знайдена');
  }
}