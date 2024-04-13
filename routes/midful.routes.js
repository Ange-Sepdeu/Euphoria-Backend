import express from "express";
const router = express.Router();
import * as admin from "../controllers/admin.controller.js";

router.route("/getCategories").get(admin.getAllCategories);

export default router;