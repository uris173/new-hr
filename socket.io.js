import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { UserModel } from "./models/data/user.js";
import { getRedisData, setRedisData, deleteRedisData } from "./redis.js";
import { syncing } from "./utils/event.sync.js";

/*
  new-user = fullName, faceUrl, employeeNo
*/

let io = null;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:9090",
        "http://192.168.26.66"
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    let token = socket.handshake.headers["authorization"]?.split(" ")[1];

    if (!token) return next(new Error("Не авторизован"));
    if (token === "null") return next(new Error("Не авторизован"));
    if (token === "SCRIPT") {
      socket.join("hr-script69")
      socket.user = { _id: "hr-script69", fullName: "hr-script", role: "user" };
      await setRedisData(`session:hr-script69:user`, socket.user)
      return next();
    }

    let decode = null;
    try {
      decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      console.error("Socket authentication error:", error);
      return next(new Error("Ошибка авторизации сокета: Ошибка декодирования токена"));
    }

    if (decode && typeof decode !== "string") {
      let userId = decode._id;
      let user = await UserModel.findById(userId, "role fullName department").lean();

      if (!user) {
        console.error("Socket authentication error: User not found!");
        return next(new Error("Ошибка авторизации сокета: Пользователь не найден!"));
      }

      let findSession = await getRedisData(`session:${userId}:${user.role}`);
      if (!findSession) {
        socket.join(userId);
        socket.user = {
          _id: userId,
          role: user.role,
          fullName: user.fullName,
          department: user?.department?.toString() || null,
        };

        await setRedisData(`session:${userId}:${user.role}`, socket.user);
      } else {
        socket.join(userId);
        socket.user = findSession;
      }

      next();
    } else {
      console.error("Socket authentication error: Token invalid!");
      next(new Error("Ошибка авторизации сокета: Токен недействителен!"));
    }
  });

  io.on("connection", async (socket) => {
    console.log("Socket connected", socket?.user?.fullName);
    if (socket.user.role === "security") {
      io.emit("start-user-sync");
    }

    socket.on("event-sync", async (data) => {
      await syncing(data);
    });

    socket.on("disconnect", async () => {
      try {
        if (socket.user) {
          await deleteRedisData(`session:${socket.user._id}:${socket.user.role}`);
          socket.leave(socket.user._id);
          console.log("Socket disconnected", socket.user.fullName);
        }
      } catch (error) {
        console.error("Error deleting session on disconnect:", error);
      }
    });
  });
};

export const getIo = async () => {
  return new Promise((resolve, reject) => {
    if (io) {
      resolve(io);
    } else {
      reject("Socket.io not initialized");
    }
  });
};