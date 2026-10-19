require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const inquiryRoutes = require('./routes/inquiry.routes');
const adminRoutes = require('./routes/admin.routes');
const uploadRoutes = require('./routes/upload.routes');
const paymentRoutes = require('./routes/payment.routes');

// Import middleware
const errorHandler = require('./middleware/error');

const path = require('path');

const app = express();

// Serve static frontend files (Vite build)
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Global Middlewares
app.use(helmet());
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
app.use((req, res, next) => {
    cors({
        origin: (origin, callback) => {
            // 1. Allow if no origin (non-browser requests like curl/simulators)
            // 2. Allow if origin matches local development whitelists or Codespaces
            if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.github.dev') || origin.endsWith('.gitpod.io')) {
                return callback(null, true);
            }
            
            // 3. Allow if it's a Same-Origin request (comparing Host header and Origin host)
            try {
                const originHost = new URL(origin).host;
                const requestHost = req.get('host');
                if (originHost === requestHost) {
                    return callback(null, true);
                }
            } catch (err) {
                // Ignore URL parsing errors
            }
            
            callback(new Error('Not allowed by CORS'));
        }
    })(req, res, next);
});
app.use(express.json());

// Morgan HTTP Request Logging
// Morganの出力を専用のaccessLoggerに連携する
const morganStream = {
    write: (message) => logger.accessLogger.info(message.trim())
};
app.use(morgan('combined', { stream: morganStream }));

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes);
// Fallback all other routes to React Frontend index.html
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

// Error Handling Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
