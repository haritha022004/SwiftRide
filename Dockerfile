# Use lightweight Node image
FROM node:18-alpine

# Install build tools for native modules
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Set CI environment variable
ENV CI=true

# Run tests once and generate JUnit report
# The report file will be picked up by Jenkins
CMD ["npm", "test", "--", "--watchAll=false", "--reporters=default", "--reporters=jest-junit"]