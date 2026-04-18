#!/usr/bin/env node
require('dotenv').config();
const readline = require('readline');
const connectDB = require('../src/config/db');
const User = require('../src/models/User');

function prompt(question, { secret = false } = {}) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    if (secret) {
      const stdin = process.openStdin();
      process.stdin.on('data', (c) => {
        c = String(c);
        if (c === '\n' || c === '\r' || c === '\u0004') stdin.pause();
        else process.stdout.write('\x1B[2K\x1B[200D' + question + Array(rl.line.length + 1).join('*'));
      });
    }
    rl.question(question, (ans) => {
      rl.close();
      resolve(ans.trim());
    });
  });
}

(async () => {
  try {
    await connectDB();
    const name = process.env.ADMIN_NAME || (await prompt('Name: '));
    const email = process.env.ADMIN_EMAIL || (await prompt('Email: '));
    const password = process.env.ADMIN_PASSWORD || (await prompt('Password: ', { secret: true }));

    if (!email || !password) {
      console.error('Email and password required.');
      process.exit(1);
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      existing.role = 'admin';
      if (password) existing.password = password;
      if (name) existing.name = name;
      existing.tokenVersion = (existing.tokenVersion || 0) + 1;
      await existing.save();
      console.log(`[seed] Promoted existing user to admin: ${existing.email}`);
    } else {
      const user = await User.create({ name: name || 'Admin', email, password, role: 'admin' });
      console.log(`[seed] Created admin: ${user.email}`);
    }
    process.exit(0);
  } catch (err) {
    console.error('[seed] Failed:', err.message);
    process.exit(1);
  }
})();
