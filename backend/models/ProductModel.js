const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number
  },
  tags: [String],
  categories: [{
    categoryName: String,
    selectedValues: [
      {
        sorterName: String,
        sorterValue: String
      }
    ]
  }],
  characteristics: [
    {
        characteristic: String,
        value: String,
    }
  ],
  images: [String],
  onSale: {
    type: Boolean,
    default: false
  },
  bestSeller: {
    type: Boolean,
    default: false
  }

});

module.exports = model("product", productSchema);
