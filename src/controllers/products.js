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
  res.status(200).json({ msg: 'products route' });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
