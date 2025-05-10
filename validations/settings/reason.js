import Joi from "joi";
import { Types } from "mongoose";

export const ReasonQueryFilter = (data) => Joi.object({
  title: Joi.string()
    .min(2)
    .max(150)
    .message({
      "string.base": "titleBase",
      "string.empty": "titleEmpty",
      "string.min": "titleMin",
      "string.max": "titleMax",
    }),

  limit: Joi.number()
    .valid(0, 1, 30, 50, 100)
    .optional()
    .messages({
      "number.base": "limitBase",
      "any.only": "limitOnly",
    }),
  page: Joi.number()
    .optional()
    .messages({
      "number.base": "pageBase",
      "number.integer": "pageinteger",
      "number.positive": "pagePositive"
    })
}).validate(data);

export const ReasonCreate = (data) => Joi.object({
  title: Joi.string()
    .min(2)
    .max(150)
    .required()
    .messages({
      "string.base": "titleBase",
      "string.empty": "titleEmpty",
      "string.min": "titleMin",
      "string.max": "titleMax",
      "any.required": "titleRequired"
    }),

  shortName: Joi.string()
    .min(1)
    .max(15)
    .required()
    .messages({
      "string.base": "shortNameBase",
      "string.empty": "shortNameEmpty",
      "string.min": "shortNameMin",
      "string.max": "shortNameMax",
      "any.required": "shortNameRequired"
    })
}).validate(data);

export const ReasonUpdate = (data) => Joi.object({
  _id: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message("_idCustom");
      }
      return value;
    })
    .required()
    .messages({
      "string.base": "_idBase",
      "any.required": "_idRequired"
    }),

  title: Joi.string()
    .min(2)
    .max(150)
    .required()
    .messages({
      "string.base": "titleBase",
      "string.empty": "titleEmpty",
      "string.min": "titleMin",
      "string.max": "titleMax",
      "any.required": "titleRequired"
    }),

  shortName: Joi.string()
    .min(1)
    .max(15)
    .required()
    .messages({
      "string.base": "shortNameBase",
      "string.empty": "shortNameEmpty",
      "string.min": "shortNameMin",
      "string.max": "shortNameMax",
      "any.required": "shortNameRequired"
    })
}).validate(data);