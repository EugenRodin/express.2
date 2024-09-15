import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import ejs from 'ejs'
import helmet from "helmet"
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const app = express()
const PORT = 3000
const SECRET_KEY = '123'

// Для визначення поточної директорії
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Налаштування PUG для сторінок користувачів
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// Налаштування EJS для сторінок статей
app.engine('ejs', ejs.renderFile)

// Статичні файли (CSS та favicon)
app.use(express.static(path.join(__dirname, 'public')))

app.use(helmet())
app.use(cookieParser())
app.use(express.json())


// Дані для користувачів і статей
const users = [
  { id: 1, name: 'John Doe', password: 'password123', email: 'john@example.com' },
  { id: 2, name: 'Jane Doe', password: 'password456', email: 'jane@example.com' }
]

const articles = [
  { id: 1, title: 'First Article', content: 'This is the first article' },
  { id: 2, title: 'Second Article', content: 'This is the second article' }
];

// Маршрут для списку користувачів
app.get('/users', (req, res) => {
  res.render('users/index', { users });
})

// Маршрут для деталей користувача
app.get('/users/:userId', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.userId));
  if (user) {
    res.render('users/details', { user })
  } else {
    res.status(404).send('User not found')
  }
})

// Маршрут для списку статей (EJS)
app.get('/articles', (req, res) => {
  res.render('articles/index.ejs', { articles })
})

// Маршрут для деталей статті (EJS)
app.get('/articles/:articleId', (req, res) => {
  const article = articles.find(a => a.id === parseInt(req.params.articleId))
  if (article) {
    res.render('articles/details.ejs', { article })
  } else {
    res.status(404).send('Article not found')
  }
})

// Маршрут для збереження теми
app.get('/set-theme/:theme', (req, res) => {
  const theme = req.params.theme
  res.cookie('theme', theme, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // Термін дії 1 день
  res.send(`Тему змінено на ${theme}`)
})

// Маршрут для отримання теми з cookies
app.get('/get-theme', (req, res) => {
  const theme = req.cookies.theme || 'default'
  res.send(`Поточна тема: ${theme}`)
})

// Маршрут для реєстрації
app.post('/register', (req, res) => {
  const { name, password, email } = req.body; // Отримати ім’я користувача, пароль і email від клієнта

  // Перевірити, чи вже існує користувач з таким email
  const userExists = users.find(u => u.email === email);

  if (userExists) {
    return res.status(400).json({ message: 'Користувач з таким email вже існує' });
  }

  // Створити нового користувача та додати до масиву
  const newUser = { id: users.length + 1, name, password, email };
  users.push(newUser);

  const token = jwt.sign({ id: newUser.id, name: newUser.name }, SECRET_KEY, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true });
  res.json({ message: 'Користувач зареєстрований', token });
})

// Маршрут для входу
app.post('/login', (req, res) => {
  const { username, password } = req.body

  // Знайти користувача за іменем
  const user = users.find(u => u.username === username && u.password === password)

  if (user) {
    // Якщо користувач знайдений, згенерувати JWT
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' })

    // Зберегти токен в cookies
    res.cookie('token', token, { httpOnly: true, sameSite: 'strict' })
    res.json({ message: 'Успішний вхід', token });
  } else {
    // Якщо дані неправильні
    res.status(401).json({ message: 'Невірне ім’я користувача або пароль' })
  }
})

// Маршрут для перевірки токена
const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Токен недійсний
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401); // Токен не знайдено
  }
};

// Захищений маршрут
app.get('/protected', authenticateJWT, (req, res) => {
  res.send('This is a protected route')
})

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})