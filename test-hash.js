const bcrypt = require('bcryptjs');

async function testPassword() {
  const hash = '$2b$10$C6bAiCSC5OH67d/eaBhh..YLFcqzU8yTP/174yv/GI3ACjQ30Llq.';
  const pw = 'password123';
  const result = await bcrypt.compare(pw, hash);
  console.log("Password match:", result);
}
testPassword();
