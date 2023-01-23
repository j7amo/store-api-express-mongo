// in this file we will POPULATE DB with PRODUCTS
// we need:
// 1) ENV variable and "connectDB" helper to connect to DB
require('dotenv').config();
const connectDB = require('./db/connect');
// 2) model to use its methods to interact with DB
const Product = require('./models/product');
// 3) Data to populate DB with
const productsJson = require('./products.json');

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    // before populating DB we make sure that it is empty
    await Product.deleteMany();
    // now we populate DB with data array
    await Product.create(productsJson);
    console.log('DB Populated!');
    // and we exit the connection
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();
