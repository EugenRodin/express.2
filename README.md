## Опис проекту
Цей проект є сервером на базі Express, який обробляє маршрути для користувачів та статей. Сервер використовує `helmet` для налаштування Content Security Policy (CSP) та підтримує шаблони `Pug` і `EJS`.

## Функціональність сервера
Сервер надає наступні функціональні можливості:
- **Маршрути для користувачів**: дозволяють отримувати список користувачів та деталі конкретного користувача.
- **Маршрути для статей**: дозволяють отримувати список статей та деталі конкретної статті.
- **Шаблони**: використовуються для рендерингу HTML сторінок. Для сторінок користувачів використовується `Pug`, а для сторінок статей - `EJS`.
- **Статичні файли**: сервер обслуговує статичні файли, такі як CSS, з директорії `public`.
- **Безпека**: використовується `helmet` для налаштування Content Security Policy (CSP).
- **Робота з Cookies**: збереження налаштувань користувача через cookies.
- **Інтеграція JWT**: авторизація користувачів через JWT.

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
- **GET /articles/:articleId**: Повертає деталі статті за `articleId`.
    - **Приклад**: `curl http://localhost:3000/articles/1`

### Тема
- **POST /theme**: Зберігає улюблену тему користувача в cookies.
    - **Приклад**: `curl -X POST -H "Content-Type: application/json" -d '{"theme":"dark"}' http://localhost:3000/theme`

### Авторизація
- **POST /register**: Реєструє нового користувача та генерує JWT.
    - **Приклад**: `curl -X POST -H "Content-Type: application/json" -d '{"username":"user1","password":"pass"}' http://localhost:3000/register`
- **POST /login**: Входить користувач та генерує JWT.
    - **Приклад**: `curl -X POST -H "Content-Type: application/json" -d '{"username":"user1","password":"pass"}' http://localhost:3000/login`
- **GET /protected**: Захищений маршрут, доступний тільки для авторизованих користувачів.
    - **Приклад**: `curl http://localhost:3000/protected`