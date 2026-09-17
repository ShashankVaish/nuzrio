const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, lowercase: true, required: true, unique: true },
    passwordHash: { type: String, select: false },
    googleId: { type: String, index: true, sparse: true },
    avatarUrl: { type: String },

    city: { type: String },
    locationEnabled: { type: Boolean, default: false },

    onboarding: {
      language: { type: String, default: 'en-GB' },
      profession: { type: String, default: null },
      niches: { type: [String], default: [] },
      voiceId: { type: String, default: null },
      briefLengthId: { type: String, default: null },
      customBriefMinutes: { type: Number, default: null },
      deliveryPeriod: { type: String, enum: ['AM', 'PM'], default: 'AM' },
      deliveryTime: { type: String, default: '07:00' },
      notificationsEnabled: { type: Boolean, default: false },
      completed: { type: Boolean, default: false },
      completedAt: { type: Date, default: null },
      currentStep: { type: Number, default: 1 },
    },

    preferences: {
      theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
      offlineMode: { type: Boolean, default: false },
      autoAdvance: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
    },

    notificationSettings: {
      morningBrief: { type: Boolean, default: true },
      breakingStory: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: true },
    },

    subscription: {
      planId: { type: String, default: 'free' },
      status: { type: String, enum: ['active', 'canceled', 'past_due'], default: 'active' },
      renewsAt: { type: Date, default: null },
    },

    refreshTokenHash: { type: String, select: false },
  },
  { timestamps: true }
);

userSchema.methods.setPassword = async function setPassword(plainPassword) {
  this.passwordHash = await bcrypt.hash(plainPassword, 10);
};

userSchema.methods.comparePassword = function comparePassword(plainPassword) {
  if (!this.passwordHash) return Promise.resolve(false);
  return bcrypt.compare(plainPassword, this.passwordHash);
};

userSchema.methods.toPublicProfile = function toPublicProfile() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    avatarUrl: this.avatarUrl,
    city: this.city,
    locationEnabled: this.locationEnabled,
    onboarding: this.onboarding,
    preferences: this.preferences,
    notificationSettings: this.notificationSettings,
    subscription: this.subscription,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
