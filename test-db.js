require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

console.log("URI:", process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false })
  .then(() => {
    console.log("Connected successfully!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection error:", err);
    process.exit(1);
  });
