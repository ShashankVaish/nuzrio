const ApiError = require('../utils/ApiError');
const env = require('../config/env');

function requireSeedKey(req, res, next) {
  if (!env.seedSecret) {
    throw ApiError.forbidden('SEED_SECRET is not configured on the server');
  }
  const provided = req.headers['x-seed-key'];
  if (provided !== env.seedSecret) {
    throw ApiError.unauthorized('Invalid seed key');
  }
  next();
}

module.exports = requireSeedKey;
