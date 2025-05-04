import Joi from "joi";
import { Types } from "mongoose";

export const BranchQueryFilter = (data) => Joi.object({
  title: Joi.string()
    .min(2)
    .max(150)
    .message({
      "string.base": "branchTitleBase",
      "string.empty": "branchTitleEmpty",
      "string.min": "branchTitleMin",
      "string.max": "branchTitleMax",
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

export const CreateBranch = (data) => Joi.object({
  title: Joi.string()
    .min(3)
    .max(150)
    .required()
    .messages({
      "any.required": "branchTitleRequired",
      "string.base": "branchTitleBase",
      "string.empty": "branchTitleEmpty",
      "string.min": "branchTitleMin",
      "string.max": "branchTitleMax",
    }),

  description: Joi.string()
    .optional()
    .required()
    .messages({
      "string.base": "branchDescriptionBase",
      "string.empty": "branchDescriptionEmpty",
      "any.required": "branchDescriptionRequired",
    }),

  location: Joi.object({
    address: Joi.string()
      .required()
      .messages({
        "any.required": "branchLocationAddressRequired",
        "string.base": "branchLocationAddressBase",
        "string.empty": "branchLocationAddressEmpty",
      }),

    coordinates: Joi.array()
      .items(Joi.number())
      .length(2)
      .required()
      .messages({
        "any.required": "branchLocationCoordinatesRequired",
        "array.base": "branchLocationCoordinatesBase",
        "array.length": "branchLocationCoordinatesLength"
      }),
  }).required(),
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
      "string.base": "branchTitleBase",
      "string.empty": "branchTitleEmpty",
      "string.min": "branchTitleMin",
      "string.max": "branchTitleMax",
    }),

  description: Joi.string()
    .optional()
    .messages({
      "string.base": "branchDescriptionBase",
      "string.empty": "branchDescriptionEmpty",
    }),

  location: Joi.object({
    address: Joi.string()
      .messages({
        "string.base": "branchLocationAddressBase",
        "string.empty": "branchLocationAddressEmpty",
      }),

    coordinates: Joi.array()
      .items(Joi.number())
      .length(2)
      .required()
      .messages({
        "any.required": "branchLocationCoordinatesRequired",
        "array.base": "branchLocationCoordinatesBase",
        "array.length": "branchLocationCoordinatesLength"
      }),
  }).optional(),
}).validate(data);