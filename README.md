# Дипломная работа (Яндекс.Практикум)

![](https://shields.io/badge/-JavaScript-yellow)
![](https://shields.io/badge/-Node.js-3E863D)
![](https://shields.io/badge/-MongoDB-00E661)
![](https://shields.io/badge/-Express.JS-384752)

## Функционал приложения 

* Регистрация и авторизация нового пользователя.
* Изменение данных созданного пользователя.
* Добавлять/удалять фильмы из категории избранные.
* В приложение присутствует валидация входных данных.
* Это backend часть приложения "Поиск фильмов". Frontend часть приложения находится [по этой ссылке](https://github.com/tyt34/movies-explorer-frontend). 

## API

### Взаимодействие с пользователем 

* `POST /signup` — создать нового пользователя. В теле запроса должен быть `name`, `email` и `password`. Формат ответа: 
```ts
{
    "data": {
        "name": "имя пользователя",
        "email": "электронная почта пользователя"
    },
    "status": "ok"
}
```

* `POST /signin` — авторизовать зарегистрированного пользователя. В теле запроса должен быть `email` и `password`. Формат ответа: 
```ts
{
    "token": "jwt_tokken",
    "status": "ok",
    "user": {
        "name": "имя пользователя",
        "email": "электронная почта пользователя"
    }
}
```

* `GET /users/me` — получить данные авторизованного пользователя. Необходим заголовок `authorization: Bearer jwt_tokken`. Формат ответа: 
```ts
{
    "data": {
        "_id": "id пользователя в базе данных",
        "email": "электронная почта пользователя",
        "name": "имя пользователя",
    }
}
```

* `PATCH /users/me` — изменить поля *name* и *email* пользователя. Необходим заголовок `authorization: Bearer jwt_tokken`. В теле запроса должен быть `name` и `email`. Формат ответа: 
```ts
{
    "data": {
        "_id": "id пользователя в базе данных",
        "email": "электронная почта пользователя",
        "name": "имя пользователя",
    }
}
```

### Взаимодействие с фильмами

* `POST /movies` — создать фильм, который будет в категории избранные зарегистрированного пользователя. Необходим заголовок `authorization: Bearer jwt_tokken`. В теле запроса должен быть `country`, `director`, `duration`, `year`, `description`, `image`, `trailer`, `thumbnail`, `movieId`, `nameRU` и `nameEN`.
* Формат ответа: 
```ts
{
    "data": {
        "country": "страна созданного фильма",
        "director": "режиссер созданного фильма",
        "duration": длительность,
        "year": "год созданного фильма",
        "description": "описание созданного фильма",
        "image": "url ссылка на постер созданного фильма",
        "trailer": "url ссылка на трейлер созданного фильма",
        "thumbnail": "url ссылка на уменьшенное изображение постера созданного фильма",
        "owner": "id пользователя, который добавил её в базу данных",
        "movieId": id фильма в базе данных предоставленного API,
        "nameRU": "название созданного фильма на русском языке",
        "nameEN": "название созданного фильма на английском языке",
        "_id": "id созданного фильма в базе данных",
    },
    "owner": id пользователя, который добавил её в базу данных",
}
```

* `DELETE /movies/:moviesId` — удалить фильм из базы данных, что удалит его из категории избранные фильмы. Необходим заголовок `authorization: Bearer jwt_tokken`. Формат ответа: 
```ts
{
    "message": "Фильм удален"
}
```

* `GET /movies` — получить все фильмы добавленные в категорию избранные авторизованного пользователя. Необходим заголовок `authorization: Bearer jwt_tokken`. Формат ответа: 
```ts
{
    "data": [
        {
            "_id": "id созданного фильма в базе данных",
            "country": "страна созданного фильма",
            "director": "режиссер созданного фильма",
            "duration": длительность,
            "year": "год созданного фильма",
            "description": "описание созданного фильма",
            "image": "url ссылка на постер созданного фильма",
            "trailer": "url ссылка на трейлер созданного фильма",
            "thumbnail": "url ссылка на уменьшенное изображение постера созданного фильма",
            "owner": "id пользователя, который добавил её в базу данных",
            "movieId": id фильма в базе данных предоставленного API,
            "nameRU": "название созданного фильма на русском языке",
            "nameEN": "название созданного фильма на английском языке",
        },
        ...
    ]
}
```

## Запуск приложения
1. npm i
2. npm start

- Не забудьте запустить frontend часть, которая находится [по этой ссылке](https://github.com/tyt34/movies-explorer-frontend). 
