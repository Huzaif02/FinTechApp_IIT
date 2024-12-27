const mongoose = require('mongoose');

const AgentPerformanceSchema = new mongoose.Schema(
  {
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent', // Reference to Agent schema
      required: true,
    },
    tasksCompleted: {
      total: {
        type: Number,
        default: 0,
      },
      successful: {
        type: Number,
        default: 0,
      },
      failed: {
        type: Number,
        default: 0,
      },
    },
    averageCompletionTime: {
      type: Number, // Average time in minutes
      default: 0,
    },
    rewardsEarned: {
      type: Number, // Total rewards earned by the agent
      default: 0,
    },
    customerFeedback: [
      {
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          trim: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    performanceScore: {
      type: Number, // Overall score calculated based on tasks and feedback
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AgentPerformance', AgentPerformanceSchema);
