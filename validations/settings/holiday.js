import Joi from "joi";
import { Types } from "mongoose";

export const holidayQueryFilter = (data) => Joi.object({
  title: Joi.string()
    .min(2)
    .max(150)
    .message({
      "string.base": "titleBase",
      "string.empty": "titleEmpty",
      "string.min": "titleMin",
      "string.max": "titleMax",
    }),
  
  year: Joi.number()
    .min(2020)
    .max(2050)
    .optional()
    .messages({
      "number.base": "yearBase",
      "number.min": "yearMin",
      "number.max": "yearMax",
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

export const createHoliday = (data) => Joi.object({
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

  date: Joi.date()
    .required()
    .messages({
      "date.base": "holidayDateBase",
      "any.required": "holidayDateRequired"
    }),
}).validate(data);

export const updateHoliday = (data) => Joi.object({
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

  date: Joi.date()
    .messages({
      "date.base": "holidayDateBase",
      "any.required": "holidayDateRequired"
    }),
}).validate(data);