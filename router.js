import { Router } from "express";
const router = Router();

import Upload from './routers/data/upload.js'
import Auth from './routers/data/auth.js'
import Department from './routers/data/department.js'
import User from "./routers/data/user.js";

router.use('/upload', Upload);
router.use('/auth', Auth);
router.use('/department', Department);
router.use('/user', User);


export default router;