require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["Super Admin", "Manager", "Support"], default: "Manager" },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function updateEmail() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    // Find the current admin
    const admin = await Admin.findOne({ email: 'admin@aerisnacks.com' });
    if (admin) {
      admin.email = 'kriya@aerisnacks.com';
      await admin.save();
      console.log("Admin email updated to kriya@aerisnacks.com");
    } else {
      const newAdmin = await Admin.findOne({ email: 'kriya@aerisnacks.com' });
      if (newAdmin) {
        console.log("Admin email is already kriya@aerisnacks.com");
      } else {
        console.log("No admin found to update");
      }
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateEmail();
