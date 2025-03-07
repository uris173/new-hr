import Joi from "joi";
import { Types } from "mongoose";

export const WorkerQueryFilter = (data) => Joi.object({
  fullName: Joi.string()
    .min(2)
    .max(100)
    .messages({
      'string.empty': 'userFullNameBase',
      'string.min': 'userFullNameMin',
      'string.max': 'userFullNameMax',
    }),

  department: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message("userDepartmentCustom");
      }
      return value;
    })
    .allow(null, "")
    .messages({
      "string.base": "userDepartmentBase",
    }),

  limit: Joi.number()
    .valid(30, 50, 100)
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

export const WorkerCreate = (data) => Joi.object({
  user: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message("workerUserCustom");
      }
      return value;
    })
    .allow(null, "")
    .messages({
      "string.base": "workerUserBase",
      "any.required": "workerUserRequired",
    }),

  department: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message("workerDepartmentCustom");
      }
      return value;
    })
    .required()
    .messages({
      "string.base": "workerDepartmentBase",
      "any.required": "workerDepartmentRequired",
    }),

  groups: Joi.array()
    .items(
      Joi.string()
      .custom((value, helpers) => {
          if (!Types.ObjectId.isValid(value)) {
            return helpers.message("workerGroupCustom");
          }
          return value;
        })
        .allow(null, "")
        .messages({
          "string.base": "workerGroupBase",
        })
    ),

  gender: Joi.string()
    .valid("male", "female", "custom")
    .required()
    .messages({
      "string.base": "workerGenderBase",
      "any.only": "workerGenderBase",
      "any.required": "workerGenderRequired",
    }),

  birthDay: Joi.date()
    .less("now")
    .required()
    .messages({
      "date.base": "workerBirthDateBase",
      "date.less": "workerBirthDayLess",
      "any.required": "workerBirthDateRequired",
    }),

  address: Joi.string()
  .max(255)
  .required()
  .messages({
    "string.base": "workerAddressBase",
    "string.max": "workerAddressMax",
    "any.required": "workerAddressRequired",
  }),

  history: Joi.array(
    Joi.object({
      company: Joi.string()
        .max(100)
        .required()
        .messages({
          "string.base": "workerHistoryCompanyBase",
          "string.max": "workerHistoryCompanyMax",
          "any.required": "workerHistoryCompanyRequired",
        }),

      staffPosition: Joi.string()
        .max(100)
        .required()
        .messages({
          "string.base": "workerHistoryPositionBase",
          "string.max": "workerHistoryPositionMax",
          "any.required": "workerHistoryPositionRequired",
        }),

      enterDate: Joi.date()
        .less("now")
        .required()
        .messages({
          "date.base": "workerHistoryEnterDateBase",
          "date.less": "workerHistoryEnterDateLess",
          "any.required": "workerHistoryEnterDateRequired",
        }),

      leaveDate: Joi.date()
        .less("now")
        .required()
        .messages({
          "date.base": "workerHistoryLeaveDateBase",
          "date.less": "workerHistoryLeaveDateLess",
          "any.required": "workerHistoryLeaveDateRequired",
        }),

      comment: Joi.string()
        .max(255)
        .allow(null, "")
        .messages({
          "string.base": "workerHistoryCommentBase",
          "string.max": "workerHistoryCommentMax",
        })
    })
  )
}).validate(data);

export const WorkerUpdate = (data) => Joi.object({
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
        return helpers.message("workerUserCustom");
      }
      return value;
    })
    .allow(null, "")
    .messages({
      "string.base": "workerUserBase",
      "any.required": "workerUserRequired",
    }),

  department: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message("workerDepartmentCustom");
      }
      return value;
    })
    .required()
    .messages({
      "string.base": "workerDepartmentBase",
      "any.required": "workerDepartmentRequired",
    }),

  groups: Joi.array()
    .items(
      Joi.string()
      .custom((value, helpers) => {
          if (!Types.ObjectId.isValid(value)) {
            return helpers.message("workerGroupCustom");
          }
          return value;
        })
        .allow(null, "")
        .messages({
          "string.base": "workerGroupBase",
        })
    ),

  gender: Joi.string()
    .valid("male", "female", "custom")
    .required()
    .messages({
      "string.base": "workerGenderBase",
      "any.only": "workerGenderBase",
      "any.required": "workerGenderRequired",
    }),

  birthDay: Joi.date()
    .less("now")
    .required()
    .messages({
      "date.base": "workerBirthDateBase",
      "date.less": "workerBirthDayLess",
      "any.required": "workerBirthDateRequired",
    }),

  address: Joi.string()
  .max(255)
  .required()
  .messages({
    "string.base": "workerAddressBase",
    "string.max": "workerAddressMax",
    "any.required": "workerAddressRequired",
  }),

  history: Joi.array(
    Joi.object({
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

      company: Joi.string()
        .max(100)
        .required()
        .messages({
          "string.base": "workerHistoryCompanyBase",
          "string.max": "workerHistoryCompanyMax",
          "any.required": "workerHistoryCompanyRequired",
        }),

      staffPosition: Joi.string()
        .max(100)
        .required()
        .messages({
          "string.base": "workerHistoryPositionBase",
          "string.max": "workerHistoryPositionMax",
          "any.required": "workerHistoryPositionRequired",
        }),

      enterDate: Joi.date()
        .less("now")
        .required()
        .messages({
          "date.base": "workerHistoryEnterDateBase",
          "date.less": "workerHistoryEnterDateLess",
          "any.required": "workerHistoryEnterDateRequired",
        }),

      leaveDate: Joi.date()
        .less("now")
        .required()
        .messages({
          "date.base": "workerHistoryLeaveDateBase",
          "date.less": "workerHistoryLeaveDateLess",
          "any.required": "workerHistoryLeaveDateRequired",
        }),

      comment: Joi.string()
        .max(255)
        .allow(null, "")
        .messages({
          "string.base": "workerHistoryCommentBase",
          "string.max": "workerHistoryCommentMax",
        })
    })
  )
}).validate(data);