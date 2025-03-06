const mongoose = require("mongoose");

async function ConnectMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports = ConnectMongo
