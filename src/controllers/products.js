const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
  // some basic (but static) filter functionality
  const products = await Product.find({
    // featured: true,
    name: 'vase table',
  });
  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  // now we set up super basic DYNAMIC filtering.
  // when we use straightforward approach of passing req.query DIRECTLY
  // to Mongoose query methods, we could face the problem:
  // if we have some unknown properties in the request (in the query parameters)
  // then the result of the query will be an empty array because there's no documents
  // in DB with this property
  // const products = await Product.find(req.query);
  const { featured } = req.query;
  // the better approach is to:
  // 1) define an object where we'll store the CORRECT (validated) query data
  // 2) check for the properties we expect to be in the query
  // 3) if they are present in the original request - add them to "queryObject"
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === 'true';
  }

  const products = await Product.find(queryObject);
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
