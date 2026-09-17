const mongoose = require('mongoose');

const { Schema } = mongoose;

const briefSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, required: true },
    label: { type: String, enum: ['morning_brief', 'weekly_digest'], default: 'morning_brief' },

    niches: { type: [String], default: [] },
    voiceId: { type: String, required: true },
    stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }],

    totalDurationSec: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'ready', 'delivered'], default: 'pending' },

    progress: {
      currentStoryIndex: { type: Number, default: 0 },
      currentPositionSec: { type: Number, default: 0 },
      playbackRate: { type: Number, default: 1 },
      isPlaying: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

briefSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Brief', briefSchema);
