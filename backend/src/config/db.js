const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  mongoose.set('strictQuery', true);

  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10_000,
    maxPoolSize: 10,
  });

  console.log(`[db] Connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);

  mongoose.connection.on('disconnected', () => {
    console.warn('[db] MongoDB disconnected');
  });
  mongoose.connection.on('error', (err) => {
    console.error('[db] MongoDB error:', err.message);
  });

  return conn;
}

module.exports = connectDB;
