require('dotenv').config();

const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nuzio',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'dev_access_secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  // Comma-separated list, e.g. "http://localhost:3000,https://nuzio.vercel.app"
  // Trailing slashes are stripped since the browser's Origin header never
  // includes one, but it's an easy typo to make when pasting a deployed URL.
  clientUrls: (process.env.CLIENT_URL || 'http://localhost:3000')
    .split(',')
    .map((url) => url.trim().replace(/\/+$/, ''))
    .filter(Boolean),
};

module.exports = env;
