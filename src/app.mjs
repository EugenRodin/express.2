import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import session from 'express-session';
import flash from 'connect-flash';

const app = express();
const PORT = 3000;
const SECRET_KEY = '123';

// Для визначення поточної директорії
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Налаштування PUG для сторінок користувачів
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Налаштування EJS для сторінок статей
app.engine('ejs', ejs.renderFile);

// Статичні файли (CSS та favicon)
app.use(express.static(path.join(__dirname, 'public/css')));

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Дані для користувачів і статей
const users = [
  { id: 1, name: 'John Doe', password: 'password123', email: 'john@example.com' },
  { id: 2, name: 'Jane Doe', password: 'password456', email: 'jane@example.com' }
];

const articles = [
  { id: 1, title: 'First Article', content: 'This is the first article' },
  { id: 2, title: 'Second Article', content: 'This is the second article' }
];

// Налаштування Passport
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    return done(null, user);
  } else {
    return done(null, false, { message: 'Невірний email або пароль' });
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id);
  if (user) {
    done(null, user);
  } else {
    done(new Error('Користувач не знайдено'), null);
  }
});

// Налаштування сесій
app.use(session({
  secret: SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: false } // Для HTTPS 
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Функція для перевірки авторизації
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

// Маршрут для стартової сторінки
app.get('/', (req, res) => {
  res.render('home');
});

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

// Маршрут для збереження теми
app.get('/set-theme/:theme', (req, res) => {
  const theme = req.params.theme;
  res.cookie('theme', theme, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
  res.send(`Тему змінено на ${theme}`);
});

// Маршрут для отримання теми з cookies
app.get('/get-theme', (req, res) => {
  const theme = req.cookies.theme || 'default';
  res.send(`Поточна тема: ${theme}`);
});

// Маршрут для відображення форми реєстрації
app.get('/register', (req, res) => {
  res.render('register.ejs', { message: req.flash('error') });
});

// Маршрут для регістрації
app.post('/register', (req, res) => {
  const { name, password, email } = req.body;

  // Перевірити, чи користувач вже існує
  const userExists = users.find(u => u.email === email);

  if (userExists) {
    req.flash('error', 'Користувач з таким email вже існує');
    return res.redirect('/register');
  }

  // Створити нового користувача
  const newUser = { id: users.length + 1, name, password, email };
  users.push(newUser);

  req.login(newUser, (err) => {
    if (err) {
      return next(err);
    }
    return res.redirect('/protected');
  });
});

// Маршрут для відображення форми входу
app.get('/login', (req, res) => {
  res.render('login.ejs', { message: req.flash('error') });
});

// Маршрут для входу
app.post('/login', (req, res, next) => {
  console.log('Данные формы:', req.body);
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('error', info.message);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', 'Вы вошли в систему');
      return res.redirect('/protected');
    });
  })(req, res, next);
});

// Маршрут для виходу
app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  })
})

// Захищений маршрут
app.get('/protected', ensureAuthenticated, (req, res) => {
  res.render('protected.ejs', { success: req.flash('success') });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;