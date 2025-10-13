const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function initDB() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    await Listing.deleteMany({});
    const listingsWithOwner = initData.data.map((obj) => ({
      ...obj,
      owner: "68cd1606741f415993c83bf6",
    }));

    const res = await Listing.insertMany(listingsWithOwner);
    console.log(res);
    console.log("Data was initialized");

    await mongoose.connection.close();
    console.log("DB connection closed");
  } catch (err) {
    console.log("Error initializing DB:", err);
  }
}

initDB();
