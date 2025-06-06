import Joi from "joi";
import { Types } from "mongoose";

export const WorkerQueryFilter = (data) => Joi.object({
  user: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message("workerUserCustom");
      }
      return value;
    })
    .required()
    .messages({
      "string.base": "workerUserBase",
      "any.required": "workerUserRequired",
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

  company: Joi.string()
    .max(100)
    .required()
    .allow(null, "")
    .messages({
      "string.base": "workerHistoryCompanyBase",
      "string.max": "workerHistoryCompanyMax",
      "any.required": "workerHistoryCompanyRequired",
    }),

  staffPosition: Joi.string()
    .max(100)
    .required()
    .allow(null, "")
    .messages({
      "string.base": "workerHistoryPositionBase",
      "string.max": "workerHistoryPositionMax",
      "any.required": "workerHistoryPositionRequired",
    }),

  enterDate: Joi.date()
    .less("now")
    .required()
    .allow(null, "")
    .messages({
      "date.base": "workerHistoryEnterDateBase",
      "date.less": "workerHistoryEnterDateLess",
      "any.required": "workerHistoryEnterDateRequired",
    }),

  leaveDate: Joi.date()
    .less("now")
    .optional()
    .allow(null, "")
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

  company: Joi.string()
    .max(100)
    .required()
    .allow(null, "")
    .messages({
      "string.base": "workerHistoryCompanyBase",
      "string.max": "workerHistoryCompanyMax",
      "any.required": "workerHistoryCompanyRequired",
    }),

  staffPosition: Joi.string()
    .max(100)
    .required()
    .allow(null, "")
    .messages({
      "string.base": "workerHistoryPositionBase",
      "string.max": "workerHistoryPositionMax",
      "any.required": "workerHistoryPositionRequired",
    }),

  enterDate: Joi.date()
    .less("now")
    .required()
    .allow(null, "")
    .messages({
      "date.base": "workerHistoryEnterDateBase",
      "date.less": "workerHistoryEnterDateLess",
      "any.required": "workerHistoryEnterDateRequired",
    }),

  leaveDate: Joi.date()
    .less("now")
    .optional()
    .allow(null, "")
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
}).validate(data);