import Joi from "joi";
import { Types } from "mongoose";

export const BranchQueryFilter = (data) => Joi.object({
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

export const CreateBranch = (data) => Joi.object({
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
      "string.base": "branchDescriptionBase",
    }),

  // location: Joi.object({
  //   address: Joi.string()
  //     .required()
  //     .messages({
  //       "any.required": "branchLocationAddressRequired",
  //       "string.base": "branchLocationAddressBase",
  //       "string.empty": "branchLocationAddressEmpty",
  //     }),

  //   coordinates: Joi.array()
  //     .items(Joi.number())
  //     .length(2)
  //     .required()
  //     .messages({
  //       "any.required": "branchLocationCoordinatesRequired",
  //       "array.base": "branchLocationCoordinatesBase",
  //       "array.length": "branchLocationCoordinatesLength"
  //     }),
  // }).required(),
}).validate(data);

export const UpdateBranch = (data) => Joi.object({
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
    .min(3)
    .max(150)
    .messages({
      "string.base": "titleBase",
      "string.empty": "titleEmpty",
      "string.min": "titleMin",
      "string.max": "titleMax",
    }),

  description: Joi.string()
    .optional()
    .messages({
      "string.base": "branchDescriptionBase",
    }),

  // location: Joi.object({
  //   address: Joi.string()
  //     .messages({
  //       "string.base": "branchLocationAddressBase",
  //       "string.empty": "branchLocationAddressEmpty",
  //     }),

  //   coordinates: Joi.array()
  //     .items(Joi.number())
  //     .length(2)
  //     .required()
  //     .messages({
  //       "any.required": "branchLocationCoordinatesRequired",
  //       "array.base": "branchLocationCoordinatesBase",
  //       "array.length": "branchLocationCoordinatesLength"
  //     }),
  // }).optional(),
}).validate(data);