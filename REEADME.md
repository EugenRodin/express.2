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
- **GET /users/:userId**: Повертає деталі користувача за `userId`.

### Статті
- **GET /articles**: Повертає список статей.
- **GET /articles/:articleId**: Повертає деталі статті за `articleId`.