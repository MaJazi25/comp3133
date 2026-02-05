const express = require("express");
const mongoose = require("mongoose");
const Restaurant = require("./models/Restaurant");

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb+srv://mehdi:WNvoyW38wSZOqa5N@cluster0.q2q2wcl.mongodb.net/lab3?appName=Cluster0")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.get("/restaurants", async (req, res) => {
  try {
    const sortBy = req.query.sortBy;
    let sortOrder = {};

    if (sortBy === "ASC") {
      sortOrder = { restaurant_id: 1 };
    } else if (sortBy === "DESC") {
      sortOrder = { restaurant_id: -1 };
    }

    const restaurants = await Restaurant.find(
      {},
      { _id: 1, cuisine: 1, name: 1, city: 1, restaurant_id: 1 }
    ).sort(sortOrder);

    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/restaurants/cuisine/:cuisine", async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ cuisine: req.params.cuisine });
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/restaurants/Delicatessen", async (req, res) => {
  try {
    const restaurants = await Restaurant.find(
      { cuisine: "Delicatessen", city: { $ne: "Brooklyn" } },
      { _id: 0, cuisine: 1, name: 1, city: 1 }
    ).sort({ name: 1 });

    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3000, () => console.log("Server running on 3000"));

