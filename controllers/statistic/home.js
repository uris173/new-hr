import { EventModel } from "../../models/data/event.js";
import { DoorModel } from "../../models/settings/door.js";
import { UserModel } from "../../models/data/user.js";

export const eventsCount = async (req, res, next) => {
  try {
    const now = new Date();
    
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 7);
    weekStart.setHours(0, 0, 0, 0);
    
    const monthStart = new Date(now);
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    
    const results = await EventModel.aggregate([
      {
        $facet: {
          today: [
            { $match: { time: { $gte: todayStart } } },
            { $count: "count" }
          ],
          week: [
            { $match: { time: { $gte: weekStart } } },
            { $count: "count" }
          ],
          month: [
            { $match: { time: { $gte: monthStart } } },
            { $count: "count" }
          ],
          total: [
            { $count: "count" }
          ]
        }
      }
    ]);
    
    const response = {
      today: results[0].today[0]?.count || 0,
      week: results[0].week[0]?.count || 0,
      month: results[0].month[0]?.count || 0,
      total: results[0].total[0]?.count || 0
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getLastEvents = async (req, res, next) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    let enterDoors = await DoorModel.find({ type: "enter", status: "active" }, "_id").lean();
    let exitDoors = await DoorModel.find({ type: "exit", status: "active" }, "_id").lean();

    let users = await UserModel.find({ role: { $ne: "admin" }, status: "active" }, "_id").lean();
    let arrivedToday = await EventModel.distinct("user", { time: { $gte: todayStart }, door: { $in: enterDoors.map(d => d._id) } });
    let notArrivedToday = users.filter(user => !arrivedToday.includes(user._id.toString()));

    let populateOptions = [
      {
        path: "user",
        select: "fullName department faceUrl",
        populate: {
          path: "department",
          select: "-_id name"
        }
      },
      {
        path: "door",
        select: "branch title type",
        populate: {
          path: "branch",
          select: "-_id title"
        }
      }
    ];

    let lastEnter = await EventModel.findOne({ door: { $in: enterDoors.map(d => d._id) } }, "type time user door pictureURL") // , door: { $in: enterDoors.map(d => d._id) }
      .populate(populateOptions)
      .sort({ time: -1 });

    let lastExit = await EventModel.findOne({ door: { $in: exitDoors.map(d => d._id) } }, "type time user door pictureURL") // , door: { $in: exitDoors.map(d => d._id) }
      .populate(populateOptions)
      .sort({ time: -1 });

    let lastEvents = await EventModel.find({ time: { $gte: todayStart }, _id: { $nin: [lastEnter?._id, lastExit?._id] } }, "type time user door pictureURL")
      .populate(populateOptions)
      .sort({ time: -1 })
      .limit(10);

    res.status(200).json({
      count: users.length,
      came: arrivedToday.length,
      notCame: notArrivedToday.length,
      lastEnter: lastEnter,
      lastExit: lastExit,
      lastEvents: lastEvents
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getDoorEvents = async (req, res, next) => {
  try {
    let populateOptions = [
      {
        path: "user",
        select: "fullName department",
        populate: {
          path: "department",
          select: "-_id name"
        }
      },
    ];

    let doors = await DoorModel.find({ status: "active" }, "_id title type branch")
      .populate({ path: 'branch', select: "-_id title" })
      .lean();

    doors = await Promise.all(doors.map(async (door) => {
      let doorEvents = await EventModel.find({ door: door._id }, "branch type time user pictureURL")
        .populate(populateOptions)
        .sort({ time: -1 })
        .limit(10);

      door.events = doorEvents;
      return door;
    }));

    res.status(200).json(doors);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getBestVisit = async (req, res, next) => {
  try {
    
  } catch (error) {
    console.error(error);
    next(error);
  }
};