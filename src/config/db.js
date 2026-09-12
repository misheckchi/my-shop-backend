const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed.`);
    console.error(`Message: ${error.message}`);
    console.log("\n💡 Check your MONGO_URI in .env and ensure your network allows the connection.");
    process.exit(1);
  }
};

module.exports = connectDB;