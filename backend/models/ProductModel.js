const { Schema, model } = require("mongoose");

const roomSchema = new Schema({
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
  characteristics: [
    {
        characteristic: String,
        value: String,
    }
  ],
  imagesData: [
    {
      name: String,
      alt: String
    }
  ],
  images: [String]
});

module.exports = model("product", roomSchema);
