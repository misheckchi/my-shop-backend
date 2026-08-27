const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log("Attempting to connect to Local MongoDB...");
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ Local MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Local Connection Failed.`);
    console.error(`Message: ${error.message}`);
    console.log("\n💡 Make sure MongoDB Community Server is installed and running on your machine.");
    process.exit(1);
  }
};

module.exports = connectDB;