import { Router } from "express";
const router = Router();

import Upload from './routers/data/upload.js'
import Auth from './routers/data/auth.js'
import Department from './routers/data/department.js'
import User from "./routers/data/user.js";
import Worker from "./routers/data/worker.js";

router.use('/upload', Upload);
router.use('/auth', Auth);
router.use('/department', Department);
router.use('/user', User);
router.use('/worker', Worker);


export default router;