import express from "express";
const adminRouter = express.Router();
import {
	createAdmin,
	deleteAdmin,
	getAdmin,
	getAllAdmin,
	login,
	updateAdmin,
} from "../controllers/admin.controller.js";

adminRouter.post("/create", createAdmin);
adminRouter.get("/getAll", getAllAdmin);
adminRouter.get("/get/:id", getAdmin);
adminRouter.put("/update/:id", updateAdmin);
adminRouter.delete("/delete/:id", deleteAdmin);
adminRouter.post("/login", login);

export default adminRouter;
