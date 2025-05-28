import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connect } from "mongoose";
import cors from "cors";
import { createServer } from "http";

import { serve, setup } from "swagger-ui-express";
import { ErrorMiddleware } from "./middleware/error.js";
import PassportAuth from "./middleware/auth.js";
import Router from "./routes.js";

import { scheduleCronOnceInMonth } from "./utils/cron.js";
import { swaggerApiSpec, options } from "./swagger-doc.js";
import { initializeRedis } from "./utils/redis.js";
import { initSocket } from "./utils/socket.io.js"
// import { elasticsearchConnection } from "./utils/elasticsearch/elasticsearch.js";
// import { createUserIndex } from "./utils/elasticsearch/index/user.index.js";


const app = express();
const server = createServer(app);


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(PassportAuth.initialize());

app.use('/api-docs/v1', serve, setup(swaggerApiSpec, options));
app.use('/files', express.static('files'));
app.use(Router);
app.use(ErrorMiddleware);


(async () => {
  try {
    initSocket(server);
    await initializeRedis();
    // await elasticsearchConnection();
    // await createUserIndex()
    await connect(process.env.MONGO_URI);
    console.log('MongoDB connected!');

    server.listen(process.env.PORT, () => {
      console.log(`Server is running on PORT: ${process.env.PORT}`);
    });

    scheduleCronOnceInMonth();
  } catch (error) {
    console.error(error);
  }
})();