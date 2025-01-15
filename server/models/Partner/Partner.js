const mongoose = require('mongoose');

const PartnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['partner'],
      default: 'partner'
    },
    password: {
      type: String,
      required: false,
    },
    areaAllotted: {
      type: String, // The geographical area assigned to the partner
      required: true,
      trim: true,
    },
    dashboard: {
      analytics: {
        type: mongoose.Schema.Types.Mixed, // Analytics data related to partner performance
        default: {},
      },
    },
    agents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent', // Reference to Agent schema
      },
    ],
    paymentIntegration: {
      accountId: {
        type: String, // Account ID for receiving payments
      },
      paymentMethods: {
        type: [String], // Supported payment methods
        default: ['Bank Transfer', 'UPI', 'Credit Card'],
      },
    },
    activities: [
      {
        action: {
          type: String, // Actions performed by the partner
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    communicationChannel: {
      type: String, // Preferred communication channel (e.g., Email, Phone)
    },
    additionalDetails: {
      type: mongoose.Schema.Types.Mixed, // Field for storing any additional parameters
      default: {},
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Suspended'],
      default: 'Active',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Partner', PartnerSchema);