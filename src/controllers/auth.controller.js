const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/ApiResponse');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const env = require('../config/env');

const googleClient = new OAuth2Client(env.googleClientId);

async function issueTokens(res, user) {
  const accessToken = signAccessToken({ sub: user._id.toString() });
  const refreshToken = signRefreshToken({ sub: user._id.toString() });
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await user.save();
  return { accessToken, refreshToken };
}

async function register(req, res) {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict('An account with this email already exists');

  const user = new User({ name, email });
  await user.setPassword(password);
  await user.save();

  const tokens = await issueTokens(res, user);
  return sendSuccess(res, 201, { user: user.toPublicProfile(), ...tokens }, 'Account created');
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) throw ApiError.unauthorized('Invalid email or password');

  const valid = await user.comparePassword(password);
  if (!valid) throw ApiError.unauthorized('Invalid email or password');

  const tokens = await issueTokens(res, user);
  return sendSuccess(res, 200, { user: user.toPublicProfile(), ...tokens }, 'Logged in');
}

async function googleAuth(req, res) {
  const { idToken } = req.body;

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: env.googleClientId,
  });
  const payload = ticket.getPayload();
  if (!payload || !payload.email) throw ApiError.unauthorized('Invalid Google token');

  let user = await User.findOne({ $or: [{ googleId: payload.sub }, { email: payload.email }] });

  if (!user) {
    user = new User({
      name: payload.name || payload.email.split('@')[0],
      email: payload.email,
      googleId: payload.sub,
      avatarUrl: payload.picture,
    });
    await user.save();
  } else if (!user.googleId) {
    user.googleId = payload.sub;
    if (!user.avatarUrl) user.avatarUrl = payload.picture;
    await user.save();
  }

  const tokens = await issueTokens(res, user);
  return sendSuccess(res, 200, { user: user.toPublicProfile(), ...tokens }, 'Logged in with Google');
}

async function refresh(req, res) {
  const { refreshToken } = req.body;

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  const user = await User.findById(payload.sub).select('+refreshTokenHash');
  if (!user || !user.refreshTokenHash) throw ApiError.unauthorized('Session expired, please log in again');

  const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
  if (!matches) throw ApiError.unauthorized('Session expired, please log in again');

  const tokens = await issueTokens(res, user);
  return sendSuccess(res, 200, tokens, 'Token refreshed');
}

async function logout(req, res) {
  req.user.refreshTokenHash = undefined;
  await req.user.save();
  return sendSuccess(res, 200, null, 'Logged out');
}

async function me(req, res) {
  return sendSuccess(res, 200, req.user.toPublicProfile());
}

module.exports = { register, login, googleAuth, refresh, logout, me };
