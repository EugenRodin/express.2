# Express Server Project

Цей проект є сервером на базі Express, який обробляє маршрути для користувачів та статей. Сервер використовує `helmet` для налаштування Content Security Policy (CSP) та підтримує шаблони `Pug` і `EJS`.

## Функціональність сервера
Сервер надає наступні функціональні можливості:
- **Маршрути для користувачів**: дозволяють отримувати список користувачів та деталі конкретного користувача.
- **Маршрути для статей**: дозволяють отримувати список статей та деталі конкретної статті.
- **Шаблони**: використовуються для рендерингу HTML сторінок. Для сторінок користувачів використовується [`Pug`]
- **Статичні файли**: сервер обслуговує статичні файли, такі як CSS, з директорії [`public`]
- **Безпека**: використовується [`helmet`]
- **Робота з Cookies**: збереження налаштувань користувача через cookies.
- **Інтеграція Passport**: авторизація користувачів через Passport з використанням локальної стратегії (email та пароль).
- **Підключення до MongoDB Atlas**: зберігання даних у базі даних MongoDB Atlas.
- **Сесії**: використання сесій для збереження стану користувача.
- **Методи для видалення, зміни та оновлення документів**: дозволяють видаляти, змінювати та оновлювати документи у базі даних.
- **Методи для додавання документів**: дозволяють додавати нові документи у колекції.
- **Отримання лише імені та email користувачів**: дозволяє отримати список користувачів з їх іменами та email.

## Встановлення
1. Клонувати репозиторій:
    ```sh
    git clone https://github.com/EugenRodin/express.2.git
    ```
2. Перейти в директорію проекту:
    ```sh
    cd express.2
    ```
3. Встановити залежності:
    ```sh
    yarn install
    ```

## Запуск сервера
1. Запустити сервер:
    ```sh
    yarn start
    ```
2. Сервер буде запущений на `http://localhost:3000`.

## Маршрути

### Користувачі
- **GET /users**: Повертає список користувачів.
    - **Приклад**: `curl http://localhost:3000/users`
- **GET /users/:userId**: Повертає деталі користувача за `userId`.
    - **Приклад**: `curl http://localhost:3000/users/1`

### Статті
- **GET /articles**: Повертає список статей.
    - **Приклад**: `curl http://localhost:3000/articles`

### Тема
- **GET /set-theme/:theme**: Зберігає улюблену тему користувача в cookies.
    - **Приклад**: `curl http://localhost:3000/set-theme/dark`
- **GET /get-theme**: Отримує улюблену тему користувача з cookies.
    - **Приклад**: `curl http://localhost:3000/get-theme`

### Авторизація
- - **POST /register**: Реєструє нового користувача.
    - **Приклад**: `curl -X POST -d "email=test@example.com&password=123456" http://localhost:3000/register`
- **POST /login**: Входить користувач.
    - **Приклад**: `curl -X POST -d "email=test@example.com&password=123456" http://localhost:3000/login`
- **GET /logout**: Виходить користувач.
    - **Приклад**: `curl http://localhost:3000/logout`
- **GET /protected**: Захищений маршрут, доступний тільки для авторизованих користувачів.
    - **Приклад**: `curl http://localhost:3000/protected`

### Операції з документами
- **Додавання документів**: Додає нові документи до колекції `test`, якщо вони не існують.
    - **Приклад**: Додає документи до колекції `test`, якщо документ з ім'ям `Test Document 1` не існує.
- **Оновлення документів**: Оновлює документи у колекції `test`.
    - **Приклад**: Оновлює документ з ім'ям `Test Document` на `test document updated`.
- **Видалення документів**: Видаляє документи з колекції `users`.
    - **Приклад**: Видаляє документ з email `jane@example.com`.

### Отримання лише імені та email користувачів
- **Отримання лише імені та email користувачів**: Використовується для отримання списку користувачів з їх іменами та email.
    - **Приклад**:
    ```javascript
    // Встановлюємо projection для отримання лише імені та email кожного користувача
    const userQuery = {}
    const projection = { name: 1, email: 1, _id: 0 }
    
    const usersCollection = db.collection('users')
    const usersList = await usersCollection.find(userQuery, { projection }).toArray()
    console.log('Користувачі лише з іменем та email', usersList)

## Робота з базою даних

### Додавання документів
- **Приклад**: Додає новий документ до колекції [`test`]
    ```javascript
    const newDocument = { name: 'Test Document', content: 'This is a test document.' }
    const result = await db.collection('test').insertOne(newDocument)
    console.log('Document added:', result.insertedId)
    ```

### Оновлення документів
- **Приклад**: Оновлює документ у колекції [`test`]
    ```javascript
    const filter = { name: 'Test Document' }
    const update = { $set: { content: 'Updated content.' } }
    const result = await db.collection('test').updateOne(filter, update)
    console.log('Documents updated:', result.modifiedCount)
    ```

### Видалення документів
- **Приклад**: Видаляє документ з колекції [`test`]
    ```javascript
    const filter = { name: 'Test Document' }
    const result = await db.collection('test').deleteOne(filter)
    console.log('Documents deleted:', result.deletedCount)
    ```

### Отримання документів
- **Приклад**: Отримує документи з колекції [`test`]
    ```javascript
    const documents = await db.collection('test').find().toArray()
    console.log('Documents:', documents)
    ```

### Отримання лише імені та email користувачів
- **Приклад**:
    ```javascript
    // Встановлюємо projection для отримання лише імені та email кожного користувача
    const userQuery = {}
    const projection = { name: 1, email: 1, _id: 0 }
    
    const usersCollection = db.collection('users')
    const usersList = await usersCollection.find(userQuery, { projection }).toArray()
    console.log('Користувачі лише з іменем та email', usersList)
    ```
    
    ## Підключення до MongoDB Atlas
Сервер підключається до MongoDB Atlas для зберігання даних. Переконайтеся, що ваш файл `config.mjs` містить правильний рядок підключення до MongoDB Atlas:

```javascript
const CONFIG = {
  URI: 'mongodb+srv://Admin:12345!"@cluster0.nh9al.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
}