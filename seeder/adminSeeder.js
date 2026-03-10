import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";

dotenv.config();

const seedAdmin = async () => {
  try {

    // DB connect
    await connectDB();

    console.log("Seeding Admin...");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      email: process.env.ADMIN_EMAIL
    });

    if (existingAdmin) {
      console.log("⚠ Admin already exists");
      process.exit();
    }

    // Create admin using ENV variables
    await Admin.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD
    });

    console.log("✅ Admin created successfully");

    process.exit();

  } catch (error) {

    console.error("❌ Seeder error:", error.message);
    process.exit(1);
  }
};

seedAdmin();