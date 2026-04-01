const mongoose = require("mongoose");

// connect to a clusetr

require("dotenv").config();
const url = process.env.MONGODB_URI;

const connectDb = async () => {
    await mongoose.connect(url);
};

module.exports = connectDb;