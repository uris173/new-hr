import Joi from "joi";
import { Types } from "mongoose";

export const AbsenceQueryFilter = (data) => Joi.object({
  user: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message("_idCustom");
      }
      return value;
    })
    .required()
    .messages({
      "any.required": "absenceUserRequired",
      "string.base": "absenceUserBase",
    }),

  year: Joi.number()
    .min(2024)
    .max(2100)
    .optional()
    .messages({
      "number.base": "absenceYearBase",
      "number.min": "absenceYearMin",
      "number.max": "absenceYearMax",
    }),

  month: Joi.number()
    .min(0)
    .max(11)
    .optional()
    .messages({
      "number.base": "absenceMonthBase",
      "number.min": "absenceMonthMin",
      "number.max": "absenceMonthMax",
    }),

  reason: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message("_idCustom");
      }
      return value;
    })
    .optional()
    .messages({
      "string.base": "absenceReasonBase",
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

export const CreateAbsence = (data) => Joi.object({
  user: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message("_idCustom");
      }
      return value;
    })
    .required()
    .messages({
      "any.required": "absenceUserRequired",
      "string.base": "absenceUserBase",
    }),

  reason: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message("_idCustom");
      }
      return value;
    })
    .required()
    .messages({
      "any.required": "absenceReasonRequired",
      "string.base": "absenceReasonBase",
    }),

  title: Joi.string()
    .min(3)
    .max(150)
    .required()
    .messages({
      "any.required": "titleRequired",
      "string.base": "titleBase",
      "string.empty": "titleEmpty",
      "string.min": "titleMin",
      "string.max": "titleMax",
    }),

  description: Joi.string()
    .optional()
    .allow("", null)
    .messages({
      "string.base": "absenceDescriptionBase",
    }),

  doc: Joi.string()
    .optional()
    .messages({
      "string.base": "absenceDocBase",
    }),

  start: Joi.date()
    .required()
    .messages({
      "any.required": "absenceStartRequired",
      "date.base": "absenceStartBase",
    }),

  end: Joi.date()
    .required()
    .messages({
      "any.required": "absenceEndRequired",
      "date.base": "absenceEndBase",
    }),
}).validate(data);

export const UpdateAbsence = (data) => Joi.object({
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
  user: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message("_idCustom");
      }
      return value;
    })
    .required()
    .messages({
      "any.required": "absenceUserRequired",
      "string.base": "absenceUserBase",
    }),

  reason: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message("_idCustom");
      }
      return value;
    })
    .required()
    .messages({
      "any.required": "absenceReasonRequired",
      "string.base": "absenceReasonBase",
    }),

  title: Joi.string()
    .min(3)
    .max(150)
    .required()
    .messages({
      "any.required": "titleRequired",
      "string.base": "titleBase",
      "string.empty": "titleEmpty",
      "string.min": "titleMin",
      "string.max": "titleMax",
    }),

  description: Joi.string()
    .optional()
    .allow("", null)
    .messages({
      "string.base": "absenceDescriptionBase",
    }),

  doc: Joi.string()
    .optional()
    .messages({
      "string.base": "absenceDocBase",
    }),

  start: Joi.date()
    .required()
    .messages({
      "any.required": "absenceStartRequired",
      "date.base": "absenceStartBase",
    }),

  end: Joi.date()
    .required()
    .messages({
      "any.required": "absenceEndRequired",
      "date.base": "absenceEndBase",
    }),
}).validate(data);