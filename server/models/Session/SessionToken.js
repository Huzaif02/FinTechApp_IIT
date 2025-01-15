const mongoose = require('mongoose');

const SessionTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true }, // The JWT token
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
  role: { type: String, enum: ['user', 'agent', 'partner', 'admin', 'super_admin'], required: true }, // User role
  createdAt: { type: Date, default: Date.now }, // When the token was created
  expiresAt: { type: Date, required: true }, // When the token expires
  deviceInfo: { type: String, default: 'Unknown Device' }, // Optional: Device or browser info
});

// Add a TTL index to automatically delete expired tokens
SessionTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('SessionToken', SessionTokenSchema);
