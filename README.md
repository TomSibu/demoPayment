# demoPayment

A minimalistic webpage with Razorpay payment gateway integration for ecommerce.

## Features

- 🎨 Clean and minimalistic UI design
- 💳 Secure Razorpay payment gateway integration
- 🛍️ Sample product catalog
- ✅ Payment verification on server-side
- 📱 Responsive design

## Prerequisites

- Node.js (v14 or higher)
- Razorpay account (for API keys)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/TomSibu/demoPayment.git
cd demoPayment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Razorpay API Keys

1. Sign up for a Razorpay account at [https://razorpay.com](https://razorpay.com)
2. Get your API keys from [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys)
3. Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

4. Edit `.env` and add your Razorpay credentials:

```
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
PORT=3000
```

### 4. Start the server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

### 5. Open in browser

Navigate to [http://localhost:3000](http://localhost:3000)

## Testing

For testing purposes, you can use Razorpay's test mode:
- Test Card: 4111 1111 1111 1111
- Any future CVV and expiry date
- Any name

## Project Structure

```
demoPayment/
├── public/
│   └── index.html      # Frontend UI
├── server.js           # Backend API server
├── package.json        # Dependencies
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
└── README.md           # Documentation
```

## API Endpoints

### POST /create-order
Creates a new Razorpay order.

**Request Body:**
```json
{
  "amount": 49900,
  "currency": "INR",
  "productName": "Premium Product"
}
```

**Response:**
```json
{
  "id": "order_xxx",
  "amount": 49900,
  "currency": "INR",
  "key": "rzp_test_xxx"
}
```

### POST /verify-payment
Verifies the payment signature.

**Request Body:**
```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "orderId": "order_xxx",
  "paymentId": "pay_xxx"
}
```

## Security Notes

- Never commit your `.env` file with actual API keys
- Always verify payment signatures on the server-side
- Use HTTPS in production
- Store sensitive data securely

## License

MIT