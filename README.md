# Webhook Deployment Guide

## Local Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. For local testing, you can use tools like [ngrok](https://ngrok.com/) to expose your local server to the internet (ngrok is blocked in EY):
   ```bash
   ngrok http 3000
   ```

## Production Deployment Options

### Option 1: Deploy to a VPS (Digital Ocean, AWS EC2, etc.)

1. Build the TypeScript project:

   ```bash
   npm run build
   ```

2. Set up a process manager like PM2:

   ```bash
   npm install -g pm2
   pm2 start dist/webhook-server.js
   ```

3. Configure Nginx as a reverse proxy:

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. Set up SSL with Let's Encrypt.

### Option 2: Deploy to Serverless Platforms

#### AWS Lambda + API Gateway

1. Create a wrapper for your Express app:

   ```typescript
   import serverless from "serverless-http";
   import { app } from "./webhook-server";

   export const handler = serverless(app);
   ```

2. Configure using Serverless Framework or AWS CDK.

#### Vercel / Netlify

Create an API route that handles the webhook.

### Option 3: Deploy using Docker

1. Create a Dockerfile:

   ```dockerfile
   FROM node:18-alpine

   WORKDIR /app

   COPY package*.json ./
   RUN npm install

   COPY . .
   RUN npm run build

   EXPOSE 3000
   CMD ["node", "dist/webhook-server.js"]
   ```

2. Build and run your Docker container:
   ```bash
   docker build -t webhook-server .
   docker run -p 3000:3000 -e WEBHOOK_SECRET=your-secret webhook-server
   ```

## Security Best Practices

1. **Always use HTTPS** for your webhook endpoints
2. **Implement signature verification** (included in the example code)
3. **Rate limiting** to prevent abuse
4. **Keep your secret key secure** - use environment variables, never commit it to version control
5. **Log all incoming requests** for debugging and audit purposes

## Providing Your Webhook URI to Clients

Once deployed, you can provide your clients with your webhook URL in this format:

```
https://your-domain.com/api/webhook
```

If you need to provide a secret key for signature verification, share it securely through a separate channel from how you share the URL.
