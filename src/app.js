const express = require('express');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const connectDB = require('./db/connect');

const app = express();

// async errors

// middlewares
app.use(express.json());

// routes
app.get('/', (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">Products route</a>');
});

// middlewares for "not found" and "error handling" MUST BE AT THE END OF MIDDLEWARE CHAIN
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

// start server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('Connected to DB...');
    app.listen(PORT, () => console.log('Server is running on PORT 3000...'));
  } catch (err) {
    console.log(err);
  }
};

start();
