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

### Статті
- **GET /articles**: Повертає список статей.
    - **Приклад**: `curl http://localhost:3000/articles`

### Тема
- **GET /set-theme/:theme**: Зберігає улюблену тему користувача в cookies.
    - **Приклад**: `curl http://localhost:3000/set-theme/dark`
- **GET /get-theme**: Отримує улюблену тему користувача з cookies.
    - **Приклад**: `curl http://localhost:3000/get-theme`

### Авторизація
- **POST /register**: Реєструє нового користувача.
    - **Приклад**: `curl -X POST -d "email=test@example.com&password=123456" http://localhost:3000/register`
- **POST /login**: Входить користувач.
    - **Приклад**: `curl -X POST -d "email=test@example.com&password=123456" http://localhost:3000/login`
- **GET /logout**: Виходить користувач.
    - **Приклад**: `curl http://localhost:3000/logout`
- **GET /protected**: Захищений маршрут, доступний тільки для авторизованих користувачів.
    - **Приклад**: `curl http://localhost:3000/protected`

### Операції з документами

#### Додавання документів
- **Маршрут**: `/api/test`
- **Метод**: `POST`
- **Що побачите у Postman**: Після відправки запиту ви побачите відповідь у форматі JSON, яка містить повідомлення про успішне додавання документа та сам документ з його ID та ім'ям. Якщо виникне помилка, ви побачите повідомлення про помилку у форматі JSON.
- **500 Internal Server Error**: Помилка при видаленні документа.

#### Оновлення документів
- **Маршрут**: `/api/test/:id`
- **Метод**: `PUT`
- **Що побачите у Postman**: Після відправки запиту ви побачите відповідь у форматі JSON, яка містить повідомлення про успішне оновлення документа та оновлений документ з його ID та новим ім'ям. Якщо виникне помилка, ви побачите повідомлення про помилку у форматі JSON.
- **500 Internal Server Error**

#### Видалення документів
- **Маршрут**: `/api/test/:id`
- **Метод**: `DELETE`
- **Що побачите у Postman**: Після відправки запиту ви побачите відповідь у форматі JSON, яка містить повідомлення про успішне видалення документа. Якщо виникне помилка, ви побачите повідомлення про помилку у форматі JSON.
- **500 Internal Server Error**

#### Отримання даних
- **Маршрут**: `/api/test`
- **Метод**: `GET`
- **Що побачите у Postman**: Після відправки запиту ви побачите відповідь у форматі JSON, яка містить список всіх документів у колекції `test` з їх ID та іменами. Якщо виникне помилка, ви побачите повідомлення про помилку у форматі JSON.
- **500 Internal Server Error**

#### Отримання користувачів з сортуванням та обмеженням
- **Маршрут**: `/api/users/sorted`
- **Метод**: `GET`
- **Опис**: Повертає список користувачів, відсортованих за віком у порядку зростання, з обмеженням до 3 документів.
- **Приклад**: `curl http://localhost:3000/api/users/sorted`
- **Що побачите у Postman**: Після відправки запиту ви побачите відповідь у форматі JSON, яка містить список користувачів, відсортованих за віком у порядку зростання, з обмеженням до 3 документів.

### Отримання користувачів з сортуванням та обмеженням

#### Отримання користувачів у порядку зростання віку
- **Маршрут**: `/api/users/sorted/ascending`
- **Метод**: `GET`
- **Опис**: Повертає список користувачів, відсортованих за віком у порядку зростання, з обмеженням до 3 документів.
- **Приклад**:
    ```sh
    curl http://localhost:3000/api/users/sorted/ascending
    ```
- **Що побачите у Postman**: Після відправки запиту ви побачите відповідь у форматі JSON, яка містить список користувачів, відсортованих за віком у порядку зростання, з обмеженням до 3 документів.

#### Отримання користувачів у порядку спадання віку
- **Маршрут**: `/api/users/sorted/descending`
- **Метод**: `GET`
- **Опис**: Повертає список користувачів, відсортованих за віком у порядку спадання, з обмеженням до 3 документів.
- **Приклад**:
    ```sh
    curl http://localhost:3000/api/users/sorted/descending
    ```
- **Що побачите у Postman**: Після відправки запиту ви побачите відповідь у форматі JSON, яка містить список користувачів, відсортованих за віком у порядку спадання, з обмеженням до 3 документів.

### Де побачити результат
- **Postman**: Ви можете використовувати Postman для відправки запитів і перегляду відповідей у форматі JSON.
- **Консоль браузера**: Якщо ви використовуєте функції з `api.mjs`, ви побачите результати в консолі браузера, оскільки функції `fetchTestData`, `addTestDocument`, `updateTestDocument` та `deleteTestDocument` виводять результати в консоль.