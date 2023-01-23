const mongoose = require('mongoose');

// define Product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'product name must be provided'],
  },
  price: {
    type: Number,
    required: [true, 'product price must be provided'],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  company: {
    type: String,
    // if we want to limit possible values we can do it with the help
    // of "enum" property in Schema. 2 main approaches are:
    // 1) just limit the values:
    // enum: ['ikea', 'liddy', 'caressa', 'marcos'],
    // 2) limit the values AND provide some message in case of incorrect value
    enum: {
      values: ['ikea', 'liddy', 'caressa', 'marcos'],
      // {VALUE} lets us get the value that was provided
      message: '{VALUE} is not supported!',
    },
  },
});

// create and export model
module.exports = mongoose.model('Product', productSchema);
