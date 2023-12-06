const { Schema, model } = require("mongoose");

const adminSchema = new Schema({
  username: {
    type: String,
    default: "admin",
    require: true
  },
  password: {
    type: String,
    default: "ad2023mf1dr2",
    require: true
  },
  categories: [
    {
      name: String,
      image: String,
      sorters: [
        {
          sorterName: String,
          sorterValues: []
        }
      ],
    }
  ]
});

module.exports = model("admin", adminSchema);
