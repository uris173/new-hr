import Joi from "joi";
import { Types } from "mongoose";

export const DepartmentQueryFilter = (data) => Joi.object({
  name: Joi.string()
    .min(2)
    .max(150)
    .optional()
    .messages({
      "string.base": "departmentNameBase",
      "string.empty": "departmentNameEmpty",
      "string.min": "departmentNameMin",
      "string.max": "departmentNameMax",
    }),

  type: Joi.number()
    .valid(1, 2)
    .messages({
      "number.base": "departmentTypeBase",
      "any.only": "departmentTypeOnly",
    }),

  parent: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message("departmentParentCustom");
      }
      return value;
    })
    .allow(null, "")
    .messages({
      "string.base": "departmentParentBase",
    }),

  chief: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message("departmentChiefCustom");
      }
      return value;
    })
    .allow(null, "")
    .messages({
      "string.base": "departmentChiefBase"
    }),

  status: Joi.string()
    .valid("active", "inactive", "deleted")
    .default("active")
    .messages({
      "string.base": "departmentStatusBase",
      "any.only": "departmentStatusOnly"
    }),

  limit: Joi.number()
    .valid(1, 30, 50, 100)
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

export const CreateDepartment = (data) => Joi.object({
  name: Joi.string()
    .min(3)
    .max(150)
    .required()
    .messages({
      "string.base": "departmentNameBase",
      "string.empty": "departmentNameEmpty",
      "string.min": "departmentNameMin",
      "string.max": "departmentNameMax",
      "any.required": "departmentNameRequired"
    }),

  type: Joi.number()
    .valid(1, 2)
    .required()
    .messages({
      "number.base": "departmentTypeBase",
      "any.only": "departmentTypeOnly",
      "any.required": "departmentTypesRequired"
    }),

  parent: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message("departmentParentCustom");
      }
      return value;
    })
    .allow(null, "")
    .messages({
      "string.base": "departmentParentBase",
    }),

  chief: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message("departmentChiefCustom");
      }
      return value;
    })
    .allow(null, "")
    .messages({
      "string.base": "departmentChiefBase"
    })
}).validate(data);

export const UpdateDepartment = (data) => Joi.object({
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

  name: Joi.string()
    .min(3)
    .max(150)
    .required()
    .messages({
      "string.base": "departmentNameBase",
      "string.empty": "departmentNameEmpty",
      "string.min": "departmentNameMin",
      "string.max": "departmentNameMax",
      "any.required": "departmentNameRequired"
    }),

  type: Joi.number()
    .valid(1, 2)
    .required()
    .messages({
      "number.base": "departmentTypeBase",
      "any.only": "departmentTypeOnly",
      "any.required": "departmentTypesRequired"
    }),

  parent: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message("departmentParentCustom");
      }
      return value;
    })
    .allow(null, "")
    .messages({
      "string.base": "departmentParentBase",
    }),

  chief: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message("departmentChiefCustom");
      }
      return value;
    })
    .allow(null, "")
    .messages({
      "string.base": "departmentChiefBase"
    })
}).validate(data);