const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Validate required environment variables
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('Error: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in .env file');
    console.error('Please copy .env.example to .env and add your Razorpay credentials');
    process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order endpoint
app.post('/create-order', async (req, res) => {
    try {
        const { amount, currency, productName } = req.body;

        // Validate input
        if (!amount || typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount. Must be a positive number.' });
        }

        const validCurrencies = ['INR', 'USD', 'EUR', 'GBP'];
        const selectedCurrency = currency || 'INR';
        if (!validCurrencies.includes(selectedCurrency)) {
            return res.status(400).json({ error: 'Invalid currency. Supported: INR, USD, EUR, GBP' });
        }

        const options = {
            amount: amount, // amount in paise
            currency: selectedCurrency,
            receipt: `receipt_${Date.now()}`,
            notes: {
                productName: productName
            }
        };

        const order = await razorpay.orders.create(options);

        res.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Verify payment endpoint
app.post('/verify-payment', (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                error: 'Missing required payment verification fields'
            });
        }

        // Create signature
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest('hex');

        // Verify signature
        if (razorpay_signature === expectedSign) {
            console.log(`Payment verified successfully: ${razorpay_payment_id}`);
            res.json({
                success: true,
                message: 'Payment verified successfully',
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id
            });
        } else {
            // Log failed verification attempt for security audit
            console.warn(`Payment verification failed for order: ${razorpay_order_id}`);
            res.status(401).json({
                success: false,
                message: 'Payment verification failed'
            });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to verify payment'
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT}/index.html in your browser`);
});
