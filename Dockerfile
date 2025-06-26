# syntax=docker/dockerfile:1

FROM node:18-alpine

# Install the utility for running commands in parallel
RUN npm install -g concurrently

# Set working directory inside the container
WORKDIR /app

# Copy server and client package files
COPY server/package.json server/package-lock.json ./server/
COPY client/package.json client/package-lock.json ./client/

# Install dependencies for both server and client
RUN npm ci --prefix server \
 && npm ci --prefix client

# Copy the entire source code into the container
COPY . .

# Expose ports for the API and the frontend
EXPOSE 3000
EXPOSE 5173

# Start both the server and frontend in dev mode simultaneously
CMD ["concurrently", \
     "npm start --prefix server", \
     "npm run dev --prefix client -- --host 0.0.0.0"]
