import { EventModel } from "../../models/data/event.js";

export const getLastEvent = async (req, res, next) => {
  try {
    let { startTime, endTime } = req.query;
    let filter = { };

    if (startTime || endTime) {
      filter.time = {};

      if (startTime) {
        const startDate = new Date(startTime);
        if (isNaN(startDate.getTime())) {
          return res.status(400).json({ message: 'Ошибка: Неверный формат startTime.' });
        }
        filter.time.$gte = startDate;
      }

      if (endTime) {
        const endDate = new Date(endTime);
        if (isNaN(endDate.getTime())) {
          return res.status(400).json({ message: 'Ошибка: Неверный формат endTime.' });
        }
        filter.time.$lte = endDate;
      }
    }

    let event = await EventModel.find(filter, "type action time user door pictureURL")
      .populate([
        { path: "user", select: "-_id fullName phone faceUrl employeeNo" },
        { path: "door", select: "-_id title ip port" }
      ])
      .sort({ time: -1 })
      .lean();

    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    next(error);
  }
};