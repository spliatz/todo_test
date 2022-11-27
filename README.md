# Тестовое задание для компании WomanUP

Стек:

- NodeJS
- Express
- MongoDB (Mongoose, Mongo Atlas)
- bcrypt
- JWT

# Как запустить приложение

```Shell
  $ git clone https://github.com/spliatz/todo_test.git
```

```Shell
  $ cd todo_test
```

```Shell
  $ npm install
```

## ENV

Вам необходимо создать _.env_ файл

```Shell
  $ touch .env
```

В нем необходимо описать следующие поля:

PORT=нужный вам порт, если не укажете, по умолчанию будет 8000  
IS_ATLAS=true, если используете mongo atlas, иначе false  
MONGO_LOCAL=uri на локальную базу данных mongodb  
MONGO_ATLAS=uri на удаленную базу данных mongo atlas  
HASH_SALT=salt для хеширования пароля  
JWT_ACCESS_KEY=секрет для access токена  
JWT_REFRESH_KEY=секрет для refresh токена

```Shell
  $ npm start
```

Приложение будет запущенно на порте, указанном в _.env_ или на 8000 порту, если в _.env_ нет поля PORT

# ENDPOINTS

## auth

- POST `/auth/sign-up` - Регистрация  
  body:

```json
{
  "name": "Name",
  "password": "Password",
  "email": "Email"
}
```

response:  
status code 201

---

- POST `/auth/sign-in` - Авторизация  
  body:

```json
{
  "email": "Email",
  "password": "Password"
}
```

response:  
status code 201

```json
{
  "access": {
    "token": "token"
  },
  "refresh": {
    "token": "token"
  }
}
```

---

- POST `/auth/refresh`  
  Authorization: Bearer {Refresh Token}  
  response:  
  status code 201

```json
{
  "access": {
    "token": "token"
  },
  "refresh": {
    "token": "token"
  }
}
```

---

- DELETE `/auth/logout`  
  Authorization: Bearer {Refresh Token}  
  response:  
  status code 200

# user

- GET `/user`  
  Authorization: Bearer {Access Token}  
  response:  
  status code 200

```json
{
  "_id": "_id",
  "name": "Name",
  "password": "",
  "email": "Email"
}
```

---

- GET `/user/{userId}/todos?page=1&limit=5`
  параметры page и limit необязательны, если оба параметра не указаны, то вернется весь список todo пользователя,  
  если указан лишь один параметр, то второму будет присвоено значение по умолчанию: page=1 limit=10.  
  Authorization: Bearer {Access Token}  
  response:  
  status code 200

```json
[
  {
    "_id": "637f4a62f3ca71dbb9021ec1",
    "title": "title",
    "description": "description",
    "created_at": "2022-11-24T10:41:38.790Z",
    "updated_at": "2022-11-24T10:41:38.790Z",
    "author": "637f447b7c5d5f909879fab5"
  },
  {
    "_id": "6380afed9526f9e4e820e9f3",
    "title": "title 2",
    "description": "description 2",
    "created_at": "2022-11-25T12:07:09.520Z",
    "updated_at": "2022-11-25T12:07:09.520Z",
    "author": "637f447b7c5d5f909879fab5"
  }
]
```

# todo

- POST `/todo`  
  Authorization: Bearer {Access Token}  
  body:

```json
{
  "title": "title 5",
  "description": "description 5"
}
```

response:  
status code 201

```json
{
  "id": "6380e1ff5e6ddcffc5ebbacc"
}
```

---

- GET `/todo/{id}`
  Authorization: Bearer {Access Token}  
  response:  
  status code 200

```json
{
  "_id": "6380e2665e6ddcffc5ebbad4",
  "title": "title",
  "description": "description",
  "created_at": "2022-11-25T15:42:30.543Z",
  "updated_at": "2022-11-25T15:42:30.544Z",
  "author": "637f447b7c5d5f909879fab5"
}
```

---

- PUT `/todo/{id}`
  Authorization: Bearer {Access Token} body:

```json
{
  "title": "title 5",
  "description": "description 5"
}
```

response:  
status code 200

```json
{
  "_id": "6380e2665e6ddcffc5ebbad4",
  "title": "title",
  "description": "description",
  "created_at": "2022-11-25T15:42:30.543Z",
  "updated_at": "2022-11-25T15:42:30.544Z",
  "author": "637f447b7c5d5f909879fab5"
}
```

---

- DELETE `/todo/{id}`  
  Authorization: Bearer {Access Token} body:  
  response:  
  status 200
