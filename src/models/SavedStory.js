const mongoose = require('mongoose');

const { Schema } = mongoose;

const savedStorySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    story: { type: Schema.Types.ObjectId, ref: 'Story', required: true },
  },
  { timestamps: true }
);

savedStorySchema.index({ user: 1, story: 1 }, { unique: true });

module.exports = mongoose.model('SavedStory', savedStorySchema);
