import express from "express";
import { adminController, homeController } from "../controllers/index.js";
import adminRouter from "./admin.route.js";

const router = express.Router();

router.get("/", homeController);
router.get("/admin", adminController);

router.use("/api/v1", adminRouter);

export default router;
