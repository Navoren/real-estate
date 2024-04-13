import { Router } from "express";
import { createListing } from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = Router();

router.route('/create').post(verifyToken, createListing);

export default router;