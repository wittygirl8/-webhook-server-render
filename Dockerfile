# Use official Node.js image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the port your app runs on (change if needed)
EXPOSE 3000

# Run the app directly (no TypeScript build step)
CMD ["node", "webhook-server.js"]
