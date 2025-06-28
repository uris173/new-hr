import { Router } from "express";
import { oneC } from "../../middleware/role.js"
import { getLastEvent } from "../../controllers/api/event.js";
const router = Router();

router.get("/get-event", oneC, getLastEvent);

export default router;