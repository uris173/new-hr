import { Router } from "express";
const router = Router();

// data
import Upload from './routers/data/upload.js'
import Auth from './routers/data/auth.js'
import Department from './routers/data/department.js'
import User from "./routers/data/user.js";
import Worker from "./routers/data/worker.js";

// settings
import Door from "./routers/settings/door.js";

// api
import ApiDoor from "./routers/api/door.js";

router.use('/api/door', ApiDoor);

router.use('/upload', Upload);
router.use('/auth', Auth);
router.use('/department', Department);
router.use('/user', User);
router.use('/worker', Worker);

router.use('/door', Door);


export default router;