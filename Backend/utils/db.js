const mongoose = require('mongoose');

let isConnected = false; // Variable to track the connection status

const connectToDB = async () => {
  // Set strict query mode for Mongoose to prevent unknown field queries.
  mongoose.set("strictQuery", true);

//   if (!process.env.MONGODB_URL) return console.log("Missing MongoDB URL");

  // If the connection is already established, return without creating a new connection.
  if (isConnected) {
    console.log("MongoDB connection already established");
    return;
  }
  try {
    await mongoose.connect("mongodb+srv://deepbindal36:1ig73FHP3REnYDya@admindb.lseoio3.mongodb.net/?retryWrites=true&w=majority&appName=admindb");

    isConnected = true; // Set the connection status to true
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectToDB;