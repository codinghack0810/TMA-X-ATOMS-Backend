import { Router } from "express";
import { test, ranking } from "../../../controller/rank.controller.js";

const router = Router();

router.get("/test", test);
router.get("/ranking", ranking);

export default router;