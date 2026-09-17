const mongoose = require('mongoose');

const { Schema } = mongoose;

const storySchema = new Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    niche: { type: String, required: true, index: true },
    source: { type: String, required: true },
    sourceUrl: { type: String },
    readMinutes: { type: Number, default: 3 },

    audioUrl: { type: String },
    durationSec: { type: Number, default: 0 },
    waveform: { type: [Number], default: [] },

    tags: { type: [String], default: [] },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

storySchema.index({ title: 'text', summary: 'text', source: 'text', tags: 'text' });

storySchema.methods.toCard = function toCard() {
  return {
    id: this._id,
    title: this.title,
    summary: this.summary,
    niche: this.niche,
    source: this.source,
    sourceUrl: this.sourceUrl,
    readMinutes: this.readMinutes,
    audioUrl: this.audioUrl,
    durationSec: this.durationSec,
    publishedAt: this.publishedAt,
  };
};

module.exports = mongoose.model('Story', storySchema);
