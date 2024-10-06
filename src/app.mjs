import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import ejs from 'ejs'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import session from 'express-session'
import flash from 'connect-flash'
import userRoutes from './routes/userRoutes.mjs'
import articleRoutes from './routes/articleRoutes.mjs'
import users from './models/userModel.mjs'
import { Admin, MongoClient } from 'mongodb'
import CONFIG from './config.mjs'
import { getUsers } from './services/userService.mjs'
import { ObjectId } from 'mongodb'
import chalk from 'chalk'

const app = express()
const PORT = process.env.PORT || 3000
const URI = CONFIG.URI
const router = express.Router()
const SECRET_KEY = '123'

// Створення нового клієнта для MongoDB Atlas
const dbName = 'my-first-database'

// Створення нового екземпляра MongoClient та підключення до бази даних
const client = new MongoClient(URI)

// Створення нового екземпляра MongoClient та підключення до бази даних 
async function connect() { 
  try { 
    // Встановлення з'єднання з MongoDB Atlas 
    await client.connect() 
    console.log('Успішно підключено до MongoDB Atlas') 
    
    // Отримання посилання на базу даних у Atlas 
    const db = client.db(dbName) 

    // Створення нової колекції, якщо вона не існує
    const collections = await db.listCollections().toArray()
    if (!collections.some(col => col.name === 'test')) {
      await db.createCollection('test')
      console.log('Колекцію test створено успішно')
    }

    // Перевірка, чи існує документ у колекції test
    const testDocument = await db.collection('test').findOne({ name: 'Test Document 1' })
    if (!testDocument) {
      console.log('Документ не існує, додаємо нові документи')

      // Додавання документів до колекції
      await db.collection('test').insertMany([
        { name: 'Test Document 1', age: 30 },
        { name: 'Test Document 2', age: 25 },
        { name: 'Test Document 3', age: 35 },
        { name: 'Test Document 4', age: 40 },
        { name: 'Test Document 5', age: 21 }
      ])
      console.log('Документи додано успішно')
    } else {
      console.log('Документи вже існують')
    }

    // Визначаємо критерій для вибору документа
    const query = { name: 'Test Document' }
    // Визначаємо нові значення для оновлення
    const update = { $set: { name: 'test document updated' } }

    // Оновлюємо один документ, який відповідає критерію
    const result = await db.collection('test').updateOne(query, update)
    console.log(`Оновлено ${result.modifiedCount} документ(ів)`)

    // Перевірка, чи існують користувачі у колекції users
    const userCount = await db.collection('users').countDocuments()
    if (userCount === 0) {
      // Додавання користувачів до колекції, якщо вони не існують
      const usersFromService = getUsers()
      await db.collection('users').insertMany(usersFromService)
      console.log('Користувачів додано успішно')
    } else {
      console.log('Користувачі вже існують')
    }

    // Визначаємо критерій для видалення документа
    const deleteQuery = { email: 'jane@example.com' }

    // Видаляємо один документ, який відповідає критерію
    const deleteResult = await db.collection('users').deleteOne(deleteQuery)
    console.log(`Видалено ${deleteResult.deletedCount} документ(ів)`)

    // Встановлюємо projection для отримання лише імені та email кожного користувача
    const userQuery = {}
    const projection = { name: 1, email: 1, _id: 0 }

    const usersCollection = db.collection('users')
    const usersList = await usersCollection.find(userQuery, { projection }).toArray()
    console.log('Користувачі лише з іменем та email', usersList)

    // Сортування документів за віком у порядку зростання та обмеження до 3 документів
    const ascendingSortedDocuments = await db
    .collection('users')
    .find({})
    .sort({ age: 1 })
    .limit(3)
    .toArray()
      console.log(chalk.magentaBright('Top 3 documents sorted by age in ascending order:'), ascendingSortedDocuments)

    // Сортування документів за віком у порядку спадання та обмеження до 3 документів
    const descendingSortedDocuments = await db
    .collection('users')
    .find({})
    .sort({ age: -1 })
    .limit(3)
    .toArray()
      console.log(chalk.magentaBright('Top 3 documents sorted by age in descending order:'), descendingSortedDocuments)
  } catch (err) {
    console.error('Помилка при роботі з базою даних', err)
  }
}

// Запуск підключення 
connect().catch(console.error)

// Для визначення поточної директорії
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use(express.urlencoded({ extended: true }))

// Налаштування Passport
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  const user = users.find(u => u.email === email && u.password === password)
  if (user) {
    return done(null, user)
  } else {
    return done(null, false, { message: 'Невірний email або пароль' })
  }
}))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id)
  if (user) {
    done(null, user)
  } else {
    done(new Error('Користувач не знайдено'), null)
  }
})

// Налаштування сесій
app.use(session({
  secret: SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: false }
}))

app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

// Функція для перевірки авторизації
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

// Маршрут для стартової сторінки
app.get('/', (req, res) => {
  res.render('home')
})

// Використання маршрутів
app.use('/users', userRoutes)
app.use('/articles', articleRoutes)

// Маршрут для отримання даних з колекції test
app.get('/api/test', async (req, res) => {
  try {
    const db = client.db(dbName);
    const documents = await db.collection('test').find().toArray()
    res.json(documents)
  } catch (err) {
    res.status(500).json({ error: 'Помилка при отриманні даних' })
  }
})

// Маршрут для додавання документа в колекцію test
app.post('/api/test', async (req, res) => {
  try {
    const db = client.db(dbName)
    const result = await db.collection('test').insertOne(req.body)
    res.status(201).json(result)
  } catch (err) {
    res.status(500).json({ error: 'Помилка при додаванні документа' })
  }
})

// Маршрут для оновлення документа в колекцію test
app.put('/api/test/:id', async (req, res) => {
  try {
    const db = client.db(dbName)
    const result = await db.collection('test').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    )
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: 'Помилка при оновленні документа' })
  }
})

// Маршрут для видалення документа з колекції test
app.delete('/api/test/:id', async (req, res) => {
  try {
    const db = client.db(dbName)
    const result = await db.collection('test').deleteOne({ _id: new ObjectId(req.params.id) })
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: 'Помилка при видаленні документа' })
  }
})

app.get('/api/users/sorted', async (req, res) => {
  try {
    await client.connect()
    const db = client.db(dbName)
    const usersCollection = db.collection('users')

    const sortedUsers = await usersCollection
      .find({})
      .sort({ age: 1 })
      .limit(3)
      .toArray()

    res.json(sortedUsers)
  } catch (err) {
    console.error('Error fetching sorted users:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  } finally {
    await client.close()
  }
})

// Маршрут для збереження теми
app.get('/set-theme/:theme', ensureAuthenticated, (req, res) => {
  const theme = req.params.theme
  res.cookie('theme', theme, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
  res.send(`Тему змінено на ${theme}`)
})

// Маршрут для отримання теми з cookies
app.get('/get-theme', ensureAuthenticated, (req, res) => {
  const theme = req.cookies.theme || 'default';
  res.send(`Поточна тема: ${theme}`)
})

// Маршрут для відображення форми реєстрації
app.get('/register', (req, res) => {
  res.render('register.ejs', { message: req.flash('error') })
})

// Маршрут для регістрації
app.post('/register', (req, res, next) => {
  const { name, password, email } = req.body

  // Перевірити, чи користувач вже існує
  const userExists = users.find(u => u.email === email)

  if (userExists) {
    req.flash('error', 'Користувач з таким email вже існує')
    return res.redirect('/register')
  }

  // Створити нового користувача
  const newUser = { id: users.length + 1, name, password, email }
  users.push(newUser)

  req.login(newUser, (err) => {
    if (err) {
      return next(err)
    }
    return res.redirect('/protected')
  })
})

// Маршрут для відображення форми входу
app.get('/login', (req, res) => {
  res.render('login.ejs', { message: req.flash('error') })
})

// Маршрут для входу
app.post('/login', (req, res, next) => {
  console.log('Данные формы:', req.body)
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      req.flash('error', info.message)
      return res.redirect('/login')
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err)
      }
      req.flash('success', 'Вы увійшли в систему')
      return res.redirect('/protected')
    })
  })(req, res, next)
})

// Маршрут для виходу
app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    res.redirect('/login')
  })
})

// Захищений маршрут
app.get('/protected', ensureAuthenticated, (req, res) => {
  res.render('protected.ejs', { success: req.flash('success') });
})

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

export default app