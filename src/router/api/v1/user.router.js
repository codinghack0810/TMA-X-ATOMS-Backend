import { Router } from "express";
import { test, login } from "../../../controller/user.controller.js";

const router = Router();

router.get("/test", test);
router.post("/login", login);

export default router;