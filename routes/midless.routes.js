import express from "express";
const router = express.Router();
import * as admin from "../controllers/admin.controller.js";

router.route("/getCategories").get(admin.getAllCategories);
router.route("/addCategory").post(admin.addCategory);
router.route("/updateCategory").put(admin.updateCategory);
router.route("/deleteCategory").put(admin.removeCategory);

router.route("/addProduct").post(admin.addProduct);
router.route("/updateProduct").put(admin.updateProduct);
router.route("/deleteProduct").put(admin.removeProduct);

router.route("/users").get(admin.getAllUsers);

export default router;