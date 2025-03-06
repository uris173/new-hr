import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connect } from "mongoose";
import cors from "cors";
import { createServer } from "http";

import { ErrorMiddleware } from "./middleware/error.js";
import PassportAuth from "./middleware/auth.js";
import Router from "./router.js";
import { swaggerApiSpec, options } from "./swagger-doc.js";
import { serve, setup } from "swagger-ui-express";
import { initializeRedis } from "./redis.js";


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
    await initializeRedis();
    await connect(process.env.MONGO_URI);
    console.log('MongoDB connected!');
    
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on PORT: ${process.env.PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
})();