const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load environment variables
dotenv.config();
console.log("Connecting to:", process.env.MONGO_URI);

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/sales', require('./src/routes/salesRoutes'));
app.use('/api/expenses', require('./src/routes/expenseRoutes'));
app.use('/api/items', require('./src/routes/itemRoutes'));

// Root Health Check Route
app.get('/', (req, res) => {
  res.send({ status: 'API operational', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});