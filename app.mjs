import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()

// Якщо потрібно використовувати __dirname в ES-модулі
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Налаштування PUG для сторінок користувачів
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views/users'))

// Налаштування EJS для сторінок статей
import ejs from 'ejs'
app.engine('ejs', ejs.renderFile)
app.set('views', path.join(__dirname, 'views/articles'))

// Статичні файли (CSS)
app.use(express.static(path.join(__dirname, 'public')))

// Дані для користувачів і статей
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Doe', email: 'jane@example.com' }
]

const articles = [
  { id: 1, title: 'First Article', content: 'This is the first article' },
  { id: 2, title: 'Second Article', content: 'This is the second article' }
]

// Маршрут для списку користувачів
app.get('/users', (req, res) => {
  res.render('index', { users })
})

// Маршрут для деталей користувача
app.get('/users/:userId', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.userId))
  if (user) {
    res.render('details', { user });
  } else {
    res.status(404).send('User not found');
  }
})

app.get('/articles', (req, res) => {
  res.render('index.ejs', { articles })
})

app.get('/articles/:articleId', (req, res) => {
  const article = articles.find(a => a.id === parseInt(req.params.articleId))
  if (article) {
    res.render('details.ejs', { article })
  } else {
    res.status(404).send('Article not found')
  }
})

// Запуск сервера
const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})