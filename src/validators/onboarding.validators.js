const { z } = require('zod');
const { LANGUAGES, PROFESSIONS, NICHES, MAX_NICHES, VOICES, BRIEF_LENGTHS } = require('../data/catalog');

const languageCodes = LANGUAGES.map((l) => l.code);
const voiceIds = VOICES.map((v) => v.id);
const briefLengthIds = BRIEF_LENGTHS.map((b) => b.id);

const step1LanguageSchema = z.object({
  language: z.enum(languageCodes, { errorMap: () => ({ message: 'Unsupported language' }) }),
  locationEnabled: z.boolean().optional(),
  city: z.string().optional(),
});

const step2ProfessionSchema = z.object({
  profession: z.enum(PROFESSIONS, { errorMap: () => ({ message: 'Unsupported profession' }) }),
});

const step3NichesSchema = z.object({
  niches: z
    .array(z.enum(NICHES))
    .min(1, 'Pick at least 1 niche')
    .max(MAX_NICHES, `Pick up to ${MAX_NICHES} niches`),
});

const step4VoiceSchema = z.object({
  voiceId: z.enum(voiceIds, { errorMap: () => ({ message: 'Unsupported voice' }) }),
  briefLengthId: z.enum(briefLengthIds, { errorMap: () => ({ message: 'Unsupported brief length' }) }),
  customBriefMinutes: z.number().int().positive().max(60).optional(),
});

const step5ScheduleSchema = z.object({
  deliveryPeriod: z.enum(['AM', 'PM']),
  deliveryTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'deliveryTime must be HH:mm'),
});

const step6NotificationsSchema = z.object({
  notificationsEnabled: z.boolean(),
});

module.exports = {
  step1LanguageSchema,
  step2ProfessionSchema,
  step3NichesSchema,
  step4VoiceSchema,
  step5ScheduleSchema,
  step6NotificationsSchema,
};
