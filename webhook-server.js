const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const dotenv = require('dotenv');
const { insertTable } = require('./db_utils');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.WEBHOOK_SECRET || 'your-secret-key';

app.use(bodyParser.json());

const verifyWebhookSignature = (req, res, next) => {
    const signature = req.headers['x-webhook-signature'];

    if (!signature) {
        console.warn('No webhook signature provided');
        return next(); // proceed without rejecting
    }

    const hmac = crypto.createHmac('sha256', SECRET_KEY);
    const calculatedSignature = hmac.update(JSON.stringify(req.body)).digest('hex');

    if (signature !== calculatedSignature) {
        console.error('Invalid webhook signature');
        return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    next();
};

app.post('/api/webhook', verifyWebhookSignature, async (req, res) => {
    try {
        console.log('Webhook received:', req.body);

        const webhookData = req.body;

        switch (webhookData.event) {
            case 'user.changes':
                console.log('User changes detected');
                break;
            case 'user.created':
                console.log('Processing user creation');
                break;
            default:
                console.log(`Received unhandled event type: ${webhookData.event}`);
                await insertTable('webhook_response', {
                    response: JSON.stringify(webhookData.event, null, 2),
                });
        }

        res.status(200).json({
            status: 'success',
            message: 'Webhook received successfully'
        });
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to process webhook'
        });
    }
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Webhook server running on port ${PORT}`);
});