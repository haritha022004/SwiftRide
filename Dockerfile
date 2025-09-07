<<<<<<< HEAD
# Stage 1: Build React frontend
FROM node:18-alpine AS build

WORKDIR /app

# Install frontend dependencies
COPY package*.json ./
RUN npm install

# Copy all frontend code
COPY . .
RUN npm run build

# Stage 2: Backend + serve frontend
FROM node:18-alpine

WORKDIR /app/backend

# Install backend dependencies
COPY backend/package*.json ./
RUN npm install

# Copy backend code
COPY backend ./

# Copy React build folder from frontend
COPY --from=build /app/build ../build

# Expose backend port
EXPOSE 3000

# Start backend (serves React build as well)
=======
# Stage 1: Build React frontend
FROM node:18-alpine AS build

WORKDIR /app

# Install frontend dependencies
COPY package*.json ./
RUN npm install

# Copy all frontend code
COPY . .
RUN npm run build

# Stage 2: Backend + serve frontend
FROM node:18-alpine

WORKDIR /app/backend

# Install backend dependencies
COPY backend/package*.json ./
RUN npm install

# Copy backend code
COPY backend ./

# Copy React build folder from frontend
COPY --from=build /app/build ../build

# Expose backend port
EXPOSE 3000

# Start backend (serves React build as well)
>>>>>>> 9835c6b45cbaf2f53adc50d74e7bcc92a47869cb
CMD ["node", "index.js"]