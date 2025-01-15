const mongoose = require('mongoose');

const TemporaryUserSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  mobile: { type: String, required: true, unique: true },
  mobileOtp: { type: String, required: true }, // OTP for mobile verification
  emailOtp: { type: String, required: true }, // OTP for email verification
  password: { type: String, required: true }, // Hashed password
  attempts: { type: Number, default: 0 }, // Track OTP resend attempts
  referredByAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', default: null },
  expiresAt: { type: Date, default: () => Date.now() + 60 * 60 * 1000 }, // Expires in 1 hour
}, { timestamps: true });

// Add TTL index for automatic cleanup
TemporaryUserSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('TemporaryUser', TemporaryUserSchema);
