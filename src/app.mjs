import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';

const app = express();

// Для визначення поточної директорії
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Налаштування PUG для сторінок користувачів
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Налаштування EJS для сторінок статей
app.engine('ejs', ejs.renderFile);

// Статичні файли (CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Дані для користувачів і статей
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Doe', email: 'jane@example.com' }
];

const articles = [
  { id: 1, title: 'First Article', content: 'This is the first article' },
  { id: 2, title: 'Second Article', content: 'This is the second article' }
];

// Маршрут для списку користувачів
app.get('/users', (req, res) => {
  res.render('users/index', { users });
});

// Маршрут для деталей користувача
app.get('/users/:userId', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.userId));
  if (user) {
    res.render('users/details', { user });
  } else {
    res.status(404).send('User not found');
  }
});

// Маршрут для списку статей (EJS)
app.get('/articles', (req, res) => {
  res.render('articles/index.ejs', { articles });
});

// Маршрут для деталей статті (EJS)
app.get('/articles/:articleId', (req, res) => {
  const article = articles.find(a => a.id === parseInt(req.params.articleId));
  if (article) {
    res.render('articles/details.ejs', { article });
  } else {
    res.status(404).send('Article not found');
  }
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});