const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });
const AudioUpload = require('./Models/AudioUpload');

(async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log("🚀 Connected to MongoDB");

    const result = await AudioUpload.deleteMany({});
    console.log(`🗑 Deleted ${result.deletedCount} audio records!`);

  } catch (err) {
    console.error("❌ Error deleting records:", err);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
})();
