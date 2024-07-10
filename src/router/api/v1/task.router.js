import { Router } from "express";
import { test, verifyFollow, verifyTelegramJoin, userRewards, shareBTCWallet, verifyWebsiteVisit, shareEmailAddress, mintXATOMS } from "../../../controller/task.controller.js";

const router = Router();

router.get("/test", test);
router.post("/verifyTwitterFollow", verifyFollow);
router.post("/verifyTelegramJoin", verifyTelegramJoin);
router.post("/shareBTCWallet", shareBTCWallet);
router.post("/verifyWebsiteVisit", verifyWebsiteVisit);
router.post("/shareEmailAddress", shareEmailAddress);
router.post("/verifyTelegramJoin", verifyTelegramJoin);
router.post("/mintXATOMS", mintXATOMS);
router.post("/userRewards", userRewards);

export default router;