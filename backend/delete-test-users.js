import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://kumarkrishna9801552_db_user:krishna%40123@cluster0.qi6qtnh.mongodb.net/GrowX?retryWrites=true&w=majority&appName=Cluster0";

const userSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  role: String,
  authProvider: String,
  createdAt: Date,
});

const User = mongoose.model("User", userSchema);

async function deleteTestUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const testEmails = [
      /test/i, /fake/i, /temp/i, /demo/i, /example/i,
      /@mailinator/, /@guerrillamail/, /@yopmail/,
      /@tempmail/, /@throwaway/
    ];

    const query = {
      role: "student",
      authProvider: "local",
      $or: [
        { email: { $regex: testEmails[0] } },
        { email: { $regex: testEmails[1] } },
        { email: { $regex: testEmails[2] } },
        { email: { $regex: testEmails[3] } },
        { email: { $regex: testEmails[4] } },
        { email: { $regex: testEmails[5] } },
        { email: { $regex: testEmails[6] } },
        { email: { $regex: testEmails[7] } },
        { email: { $regex: testEmails[8] } },
        { email: { $regex: testEmails[9] } },
      ]
    };

    const result = await User.deleteMany(query);
    console.log(`🗑️ Deleted ${result.deletedCount} test users`);

    const allUsers = await User.find({ role: "student" }).select("email fullname createdAt");
    console.log(`\n📋 Remaining student users (${allUsers.length}):`);
    allUsers.forEach(u => console.log(`  - ${u.email} (${u.fullname})`));

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

deleteTestUsers();
