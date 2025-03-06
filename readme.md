# 📄 .env Configuration Guide

Этот файл содержит переменные окружения, необходимые для корректной работы проекта.  
Перед запуском убедитесь, что `.env` файл находится в корневой директории проекта и содержит следующие ключи:

## 🔑 Обязательные переменные

```env
ACCESS_TOKEN_SECRET = access_token_secret
REFRESH_TOKEN_SECRET = refresh_token_secret
PORT = port
MONGO_URI = mongodb://127.0.0.1:27017/DB_NAME
