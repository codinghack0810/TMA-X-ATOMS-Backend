import { Router } from "express";
import { test, telegram, twitter, btcWallet } from "../../../controller/task.controller.js";

const router = Router();

router.get("/test", test);
router.post("/telegram", telegram);
router.post("/twitter", twitter);
router.post("/btcwallet", btcWallet);

export default router;