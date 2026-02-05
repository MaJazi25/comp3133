const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema(
  {
    address: {
      building: { type: String },
      street: { type: String },
      zipcode: { type: String }
    },
    city: { type: String, required: true, trim: true },
    cuisine: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    restaurant_id: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", RestaurantSchema, "Restaurants");

