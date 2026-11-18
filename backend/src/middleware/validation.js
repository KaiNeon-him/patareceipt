const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map((d) => d.message),
    });
  }
  next();
};

const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    businessName: Joi.string().max(100).required(),
    defaultCurrency: Joi.string().length(3).default('USD'),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  createReceipt: Joi.object({
    clientName: Joi.string().max(100).required(),
    clientPhone: Joi.string().pattern(/^(\+254|254|0)?[17]\d{8}$/).required(),
    items: Joi.array().items(
      Joi.object({
        description: Joi.string().max(200).required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().precision(2).positive().required(),
      })
    ).min(1).required(),
    termsAndNotes: Joi.string().max(1000).allow('').optional(),
  }),
  updateProfile: Joi.object({
    businessName: Joi.string().max(100).optional(),
    defaultCurrency: Joi.string().length(3).optional(),
    contactEmail: Joi.string().email().optional(),
  }),
};

module.exports = { validate, schemas };