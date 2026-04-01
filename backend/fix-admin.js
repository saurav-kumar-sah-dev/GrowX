import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://kumarkrishna9801552_db_user:krishna%40123@cluster0.qi6qtnh.mongodb.net/GrowX?retryWrites=true&w=majority&appName=Cluster0";

const userSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  role: String,
  isEmailVerified: Boolean,
  isActive: Boolean,
});

const User = mongoose.model("User", userSchema);

async function fixAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const admin = await User.findOne({ email: "kumarkrishna9801552@gmail.com" });
    
    if (!admin) {
      console.log("❌ Admin not found. Run seedAdmin.js first.");
    } else {
      admin.isEmailVerified = true;
      admin.isActive = true;
      admin.role = "admin";
      await admin.save();
      console.log("✅ Admin fixed:", admin.email, "| role:", admin.role, "| verified:", admin.isEmailVerified);
    }

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

fixAdmin();
