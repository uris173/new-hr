import { Types } from "mongoose";

export const validateObjectId = (source, key) => {
  return (req, res, next) => {
    const id = req[source][key];

    if (!id) throw { status: 400, message: "idNotFound" };
    if (!Types.ObjectId.isValid(id)) throw { status: 400, message: "invalidId" };

    next();
  };
};