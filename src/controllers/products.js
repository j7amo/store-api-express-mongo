const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
  // some basic (but static) filter functionality
  const products = await Product.find({
    // featured: true,
    // name: 'vase table',
  }).sort('-name price');
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
  const {
    featured, company, name, sort, fields,
  } = req.query;
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

  // to implement SORTING functionality we'll have to change the flow of the code:
  // Mongoose gives us a "sort" method that we can use by chaining it AFTER the "find" query.
  // But the problem with our previous setup is that we "await Product.find()" which resolves
  // to already final data that "sort" CANNOT BE CHAINED FROM! So in order to fix this
  // we need to postpone "await" UNTIL we HAVE FULL QUERY CHAIN FORMED!
  let result = Product.find(queryObject);

  // if user provided "sort" query param
  if (sort) {
    // we need to create a correct string which basically means that we
    // must transform for example "name,price" to "name price" (because this is how
    // we set sorting options in "sort" query method):
    const updatedSort = sort.replace(/,/g, ' ');
    // we chain "sort" to the original "Product.find(queryObject)" query:
    result = result.sort(updatedSort);
  } else {
    // let's imagine that the user did not pass any "sort" options BUT
    // we still want to do some sorting (e.g. by date created)
    result = result.sort('createdAt');
  }

  // we can query only those fields that are of interest to user if we want.
  // to do this we:
  // 1) introduce a new query param by the name "fields" (it can have any name we want by the way);
  // 2) destructure it from "req.query";
  // 3) check if it was provided in the request;
  // 4) do the same thing as with "sort" functionality (replacing, chaining corresponding method).
  if (fields) {
    const updatedSort = fields.replace(/,/g, ' ');
    result = result.select(updatedSort);
  }

  // and when we have the complete query chain we can finally await it:
  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
