import { Router } from "express";
import { test, tokenBalance } from "../../../controller/token.controller.js";

const router = Router();

router.get("/test", test);
router.post("/tokenbalance", tokenBalance);

export default router;