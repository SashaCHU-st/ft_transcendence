
# syntax=docker/dockerfile:1

FROM node:18-alpine

# Install utilities and concurrently
RUN apk add --no-cache dos2unix openssl \
 && npm install -g concurrently

WORKDIR /app

COPY server/package.json server/package-lock.json ./server/
RUN npm ci --prefix server --omit=dev

COPY client/package.json client/package-lock.json ./client/
RUN npm ci --prefix client

COPY . .

EXPOSE 3000 5173

CMD ["concurrently", \
     "npm start --prefix server", \
     "npm run dev --prefix client -- --host 0.0.0.0"]
