import Joi from "joi";

export const LoginValidation = (data) => Joi.object({
  phone: Joi.string()
  .pattern(/^998 \((90|91|93|94|95|97|98|99|33|88|50|77)\) \d{3}-\d{2}-\d{2}$/)
  .required()
  .messages({
    'string.empty': 'phoneEmpty',
    "string.pattern.base": "phonePattern",
    "any.required": "phoneRequired"
  }),
  password: Joi.string()
  .min(5)
  .max(50)
  .required()
  .messages({
    "string.min": "passwordMin",
    "string.max": "passwordMax",
    "any.required": "passwordRequired"
  })
}).validate(data);