export interface Language {
  code: string;
  name: string;
  nativeName: string;
  tagline: string;
}

export interface Voice {
  id: string;
  name: string;
  languageCode: string;
  languageLabel: string;
  description: string;
  accent: string;
  sampleUrl: string;
}

export interface BriefLength {
  id: string;
  label: string;
  minutes: number | null;
}

export interface Plan {
  id: string;
  name: string;
  priceInr: number;
  interval: "month" | "year";
  launchOffer?: boolean;
  features: string[];
}

export interface Catalog {
  languages: Language[];
  professions: string[];
  niches: string[];
  maxNiches: number;
  voices: Voice[];
  briefLengths: BriefLength[];
  deliveryTimeSlots: string[];
}

export interface Onboarding {
  language: string;
  profession: string | null;
  niches: string[];
  voiceId: string | null;
  briefLengthId: string | null;
  customBriefMinutes: number | null;
  deliveryPeriod: "AM" | "PM";
  deliveryTime: string;
  notificationsEnabled: boolean;
  completed: boolean;
  currentStep: number;
}

export interface Preferences {
  theme: "dark" | "light";
  offlineMode: boolean;
  autoAdvance: boolean;
  pushNotifications: boolean;
}

export interface NotificationSettings {
  morningBrief: boolean;
  breakingStory: boolean;
  weeklyDigest: boolean;
}

export interface Subscription {
  planId: string;
  status: "active" | "canceled" | "past_due";
  renewsAt: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  city?: string;
  locationEnabled: boolean;
  onboarding: Onboarding;
  preferences: Preferences;
  notificationSettings: NotificationSettings;
  subscription: Subscription;
}

export interface StoryCard {
  id: string;
  title: string;
  summary: string;
  niche: string;
  source: string;
  sourceUrl?: string;
  readMinutes: number;
  audioUrl?: string;
  durationSec: number;
  publishedAt: string;
  saved?: boolean;
}

export interface Brief {
  id: string;
  date: string;
  label: string;
  niches: string[];
  voiceId: string;
  status: "pending" | "ready" | "delivered";
  totalDurationSec: number;
  progress: {
    currentStoryIndex: number;
    currentPositionSec: number;
    playbackRate: number;
    isPlaying: boolean;
  };
  stories: StoryCard[];
}
