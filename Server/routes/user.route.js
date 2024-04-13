import { Router } from "express";
import { test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = Router()

router.get("/test", test);
router.route("/update/:id").post(verifyToken, updateUser);

export default router;