const mongoose = require("mongoose");

// require("dotenv").config();

const uri = "mongodb+srv://mohankumarmarkuli_db_user:H3mYMhJOQHqOsv6F@namastenode.voiccvs.mongodb.net/devTinder";

// connect to a clusetr
const connectDb = async () => {
    await mongoose.connect(uri);
};

module.exports = connectDb;