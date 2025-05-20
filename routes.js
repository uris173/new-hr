import { Router } from "express";
const router = Router();

// data
import Upload from './routers/data/upload.js'
import Auth from './routers/data/auth.js'
import Department from './routers/data/department.js'
import User from "./routers/data/user.js";
import Worker from "./routers/data/worker.js";
import Event from "./routers/data/event.js";

// settings
import Branch from "./routers/settings/branch.js";
import Door from "./routers/settings/door.js";
import Holiday from "./routers/settings/holiday.js";
import Reason from "./routers/settings/reason.js";
import Absence from "./routers/settings/absence.js"

// statistic
import UserStatistic from "./routers/statistic/user.js";
import HomeStatistic from "./routers/statistic/home.js";

// api
import ApiDoor from "./routers/api/door.js";

router.use('/api/door', ApiDoor);

router.use('/upload', Upload);
router.use('/auth', Auth);
router.use('/department', Department);
router.use('/user', User);
router.use('/worker', Worker);
router.use('/event', Event);

router.use('/branch', Branch);
router.use('/door', Door);
router.use('/holiday', Holiday);
router.use('/reason', Reason);
router.use('/absence', Absence);

router.use('/statistic/user', UserStatistic);
router.use('/statistic/home', HomeStatistic);


export default router;