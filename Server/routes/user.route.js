import { Router } from "express";
import { test, updateUser, deleteUser, getListingsByUser, getUser } from "../controllers/user.controller.js";
import {verifyToken}  from "../utils/verifyUser.js";
const router = Router()

router.get("/test", test);
router.route("/update/:id").post(verifyToken, updateUser);
router.route("/delete/:id").delete(verifyToken, deleteUser);
router.route("/listings/:id").get(verifyToken, getListingsByUser);
router.route("/:id").get(verifyToken, getUser);

export default router;