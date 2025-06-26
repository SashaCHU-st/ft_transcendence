
# # # syntax=docker/dockerfile:1

# # ##############
# # # 0) base
# # ##############
# # FROM node:18-slim AS base
# # WORKDIR /app
# # COPY package.json ./

# # ##############
# # # 1) backend
# # ##############
# # FROM base AS backend

# # RUN apt-get update \
# #  && apt-get install -y --no-install-recommends openssl \
# #  && rm -rf /var/lib/apt/lists/*

# # WORKDIR /app/server
# # COPY server/package*.json ./
# # COPY server/.env          ./
# # RUN npm install

# # # копируем код и shared
# # COPY server/      ./
# # COPY ../shared    /app/shared

# # # добавляем entrypoint для генерации certs
# # COPY entrypoint.sh /app/entrypoint.sh
# # RUN chmod +x /app/entrypoint.sh

# # ENTRYPOINT ["/app/entrypoint.sh"]

# # EXPOSE 3000
# # CMD ["npm", "run", "dev"]

# # ##############
# # # 2) frontend
# # ##############
# # FROM base AS frontend

# # WORKDIR /app/client
# # COPY client/package*.json ./
# # RUN npm install

# # # клиент, shared и certs с бекенда
# # COPY client/         ./
# # COPY ../shared       /app/shared
# # COPY ../server/cert  /app/server/cert

# # RUN find src -type f -name '*.test.ts*' -delete

# # # .entrypoint
# # COPY --from=backend /app/server/cert /app/server/cert

# # EXPOSE 5173
# # CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]




# # syntax=docker/dockerfile:1

# FROM node:18-slim AS base

# WORKDIR /app

# COPY package.json package-lock.json ./

# # 1) backend (dev) — с nodemon и генерацией сертификатов

# FROM base AS backend

# # openssl для генерации certs
# RUN apt-get update \
#  && apt-get install -y --no-install-recommends openssl \
#  && rm -rf /var/lib/apt/lists/*

# WORKDIR /app/server

# COPY server/package.json server/package-lock.json ./

# RUN npm ci

# COPY server/      ./
# COPY ../shared    /app/shared

# COPY entrypoint.sh /app/entrypoint.sh

# RUN chmod +x /app/entrypoint.sh

# ENTRYPOINT ["/app/entrypoint.sh"]
# EXPOSE 3000
# CMD ["npm", "run", "dev"]


# # 2) frontend (dev) — с Vite & certs из backend

# FROM base AS frontend

# WORKDIR /app/client

# COPY client/package.json client/package-lock.json ./

# RUN npm ci

# # код + shared
# COPY client/         ./
# COPY ../shared       /app/shared

# # подтягиваем сгенерированные certs из backend-стадии
# COPY --from=backend /app/server/cert /app/server/cert

# RUN find src -type f -name '*.test.ts*' -delete

# EXPOSE 5173

# # CMD запускает Vite в режиме разработки, флаг --host 0.0.0.0 нужен, 
# # чтобы сервер был доступен не только внутри контейнера, но и извне (для проброса порта).
# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]





# syntax=docker/dockerfile:1

FROM node:18-alpine

# Устанавливаем глобально утилиту для параллельного запуска
RUN npm install -g concurrently

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем package-файлы сервера и клиента
COPY server/package.json server/package-lock.json ./server/
COPY client/package.json client/package-lock.json ./client/

# Устанавливаем зависимости
RUN npm ci --prefix server \
 && npm ci --prefix client

# Копируем весь исходный код проекта сразу
COPY . .

# Экспонируем порты
EXPOSE 3000   
EXPOSE 5173   

# Запускаем сервер и фронтенд параллельно
CMD ["concurrently", \
     "npm start --prefix server", \
     "npm run dev --prefix client -- --host 0.0.0.0"]

