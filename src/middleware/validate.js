const ApiError = require('../utils/ApiError');


function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));
      throw ApiError.badRequest('Validation failed', details);
    }
    req.body = result.data;
    next();
  };
}

module.exports = validate;
