# # syntax=docker/dockerfile:1

# FROM node:18-alpine

# # install utils
# RUN apk add --no-cache dos2unix openssl \
#  && npm install -g concurrently

# WORKDIR /app

# # Copy server + client package files & install
# COPY server/package.json server/package-lock.json ./server/
# RUN npm ci --prefix server --omit=dev

# COPY client/package.json client/package-lock.json ./client/
# RUN npm ci --prefix client

# # Copy entrypoint + rest of code
# COPY entrypoint.sh ./
# COPY . .

# # convert entrypoint to unix line endings & make executable
# RUN dos2unix ./entrypoint.sh \
#  && chmod +x ./entrypoint.sh

# # open ports
# EXPOSE 3000
# EXPOSE 5173

# # always run entrypoint via sh, then hand off to concurrently
# ENTRYPOINT ["sh", "/app/entrypoint.sh"]
# CMD ["concurrently", \
#      "npm start --prefix server", \
#      "npm run dev --prefix client -- --host 0.0.0.0"]


# syntax=docker/dockerfile:1

FROM node:18-alpine

# Install utilities and concurrently
RUN apk add --no-cache dos2unix openssl \
 && npm install -g concurrently

WORKDIR /app

# 1) Устанавливаем зависимости сервера (production only)
COPY server/package.json server/package-lock.json ./server/
RUN npm ci --prefix server --omit=dev

# 2) Устанавливаем зависимости клиента (dev для Vite)
COPY client/package.json client/package-lock.json ./client/
RUN npm ci --prefix client

# 3) Копируем всё приложение
COPY . .

# 4) Открываем порты API и фронта
EXPOSE 3000 5173

# 5) Запускаем сервер и фронтенд параллельно
CMD ["concurrently", \
     "npm start --prefix server", \
     "npm run dev --prefix client -- --host 0.0.0.0"]
