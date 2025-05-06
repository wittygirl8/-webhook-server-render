# Use official Node.js image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files first (leverages Docker layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose the port your app runs on (default: 3000)
EXPOSE 3000

# Run the compiled app
CMD ["node", "dist/webhook-server.js"]
