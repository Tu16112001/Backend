module.exports = validateRequest;

function validateRequest(req, next, schema) {
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
  };

  if (Array.isArray(req.body)) {
    for (var i = 0; i < req.body.length; i++) {
      const { error, value } = schema.validate(req.body[i], options);
      if (error) {
        next(
          `Validation error: ${error.details.map((x) => x.message).join(", ")}`
        );
      } else {
        req.body[i] = value;
      }
    }

    next();
  } else {
    const { error, value } = schema.validate(req.body, options);
    if (error) {
      next(
        `Validation error: ${error.details.map((x) => x.message).join(", ")}`
      );
    } else {
      req.body = value;
      next();
    }
  }
}
