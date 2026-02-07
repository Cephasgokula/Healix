/**
 * Create Admin User Script
 * 
 * Run this script to create an admin user in the database.
 * Usage: node create-admin.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './.env' });

const DB = process.env.DATABASE;

// User schema (simplified version)
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  password: String,
  passwordConfirm: String,
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    await mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Admin credentials - CHANGE THESE!
    const adminEmail = 'admin@healix.com';
    const adminPassword = 'Admin@123';
    const adminName = 'Admin User';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists:', adminEmail);
      
      // Update to admin role if not already
      if (existingAdmin.role !== 'admin') {
        await User.updateOne({ email: adminEmail }, { role: 'admin' });
        console.log('Updated user role to admin');
      }
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      
      await User.create({
        name: adminName,
        email: adminEmail,
        role: 'admin',
        password: hashedPassword,
        passwordConfirm: hashedPassword,
      });

      console.log('✅ Admin user created successfully!');
      console.log('   Email:', adminEmail);
      console.log('   Password:', adminPassword);
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
