import express from "express";
import {
	createCategory,
	deleteCategory,
	getAllCategory,
	getCategory,
	updateCategory,
} from "../controllers/category.controller.js";
const categoryRouter = express.Router();

categoryRouter.post("/create", createCategory);
categoryRouter.post("/getAll", getAllCategory);
categoryRouter.post("/get/:id", getCategory);
categoryRouter.post("/update/:id", updateCategory);
categoryRouter.post("/delete/:id", deleteCategory);

export default categoryRouter;
