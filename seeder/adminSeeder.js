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
      email: "vikasjanju7@gmail.com"
    });

    if (existingAdmin) {
      console.log("⚠ Admin already exists");
      process.exit();
    }

    // Create admin
    await Admin.create({
      name: "vikas",
      email: "vikasjanju7@gmail.com",
      password: "vikas2004"
    });

    console.log("✅ Admin created successfully");

    process.exit();

  } catch (error) {

    console.error("❌ Seeder error:", error.message);

    process.exit(1);
  }
};

seedAdmin();