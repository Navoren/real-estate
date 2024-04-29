import { Router } from "express";
import { signup, signin, google, signOut, refreshAccessToken } from "../controllers/auth.controller.js";

const router = Router(); 

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/signout").get(signOut);
router.route("/google").post(google);
router.route("/refresh-token").post(refreshAccessToken);

export default router;