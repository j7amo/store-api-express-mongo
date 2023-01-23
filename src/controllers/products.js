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
  const { featured, company, name } = req.query;
  // the better approach is to:
  // 1) define an object where we'll store the CORRECT (validated) query data
  // 2) check for the properties we expect to be in the query
  // 3) if they are present in the original request - add them to "queryObject"
  const queryObject = {};

  // we check for values in the query params and add them if they are truthy
  if (featured) {
    queryObject.featured = featured === 'true';
  }

  if (company) {
    queryObject.company = company;
  }

  if (name) {
    // here we are not just adding "name" value as it is BUT
    // we are setting up the Regex object where:
    queryObject.name = {
      // - $regex - a pattern to match (e.g. in our case we basically check
      // if "name" includes the value from the request)
      // - $options - options (e.g. in our case we use "i" which is for case-insensitive match)
      $regex: name,
      $options: 'i',
    };
  }

  const products = await Product.find(queryObject);
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
