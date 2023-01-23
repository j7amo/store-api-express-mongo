const express = require('express');
require('dotenv').config();
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const PORT = process.env.PORT || 3000;
// async errors
const app = express();

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
    // connectDB
    app.listen(PORT, () => console.log('Server is running on PORT 3000...'));
  } catch (err) {
    console.log(err);
  }
};

start();
