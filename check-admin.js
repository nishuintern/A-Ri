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

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const admins = await Admin.find({});
  console.log("Admins:", admins);
  process.exit(0);
}

check();
