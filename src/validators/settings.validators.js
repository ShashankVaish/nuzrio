const { z } = require('zod');

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  city: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

const updatePreferencesSchema = z.object({
  theme: z.enum(['dark', 'light']).optional(),
  offlineMode: z.boolean().optional(),
  autoAdvance: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
});

const updateNotificationSettingsSchema = z.object({
  morningBrief: z.boolean().optional(),
  breakingStory: z.boolean().optional(),
  weeklyDigest: z.boolean().optional(),
});

module.exports = {
  updateProfileSchema,
  updatePreferencesSchema,
  updateNotificationSettingsSchema,
};
