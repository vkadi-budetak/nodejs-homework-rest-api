const mongoose = require("mongoose");

const { DB_HOST } = process.env;

exports.dbConnect = async () => {
  try {
    await mongoose.connect(DB_HOST);
    console.log("Database connection successful");
  } catch (error) {
    console.log(error);
  }
};
