const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' }); 
const User = require('./Models/userModel'); 

(async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log("🚀 Connected to MongoDB");

    const result = await User.deleteMany({});
    console.log(`🗑 Deleted ${result.deletedCount} user records!`);

  } catch (err) {
    console.error("❌ Error deleting users:", err);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
})();
