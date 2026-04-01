import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    // ✅ Check env variables
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not found in .env");
    }
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      throw new Error("ADMIN credentials missing in .env");
    }

    // ✅ Connect DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // ✅ Check existing admin
    const exist = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (exist) {
      console.log("⚠️ Admin already exists");
      process.exit(0);
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    // ✅ Create admin
    await User.create({
      fullname: "Admin",
      email: process.env.ADMIN_EMAIL,
      phoneNumber: "9999999999",
      password: hashedPassword,
      role: "admin",
      isActive: true,
      isEmailVerified: true,
    });

    console.log("🔥 Admin created successfully");
    process.exit(0);

  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();