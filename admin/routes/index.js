import express from "express";
import { homeController } from "../controllers/index.js";
import { messageMiddleware } from "../middlewares/message.middleware.js";
// import bookRouter from "./book.route.js";
// import contentTypeRouter from "./contentType.route.js";
// import permissionRouter from "./permission.route.js";
import adminRouter from "./admin.route.js";
import categoryRouter from "./category.route.js";
import {
	loginGetController,
	loginPostController,
	logoutController,
} from "../controllers/auth.controller.js";
import { userVerification } from "../middlewares/userVerification.middleware.js";
import { getBreadcrumbs } from "../middlewares/breadcrumbs.middleware.js";

const router = express.Router();

// messageMiddleware
router.use(messageMiddleware);

// admin public file serve
router.use("/public", express.static("/admin/public"));

router.get("/", userVerification, homeController);

router.get("/login", loginGetController);
router.post("/login", loginPostController);
router.get("/logout", logoutController);

// // admin/books
// router.use("/book", userVerification, bookRouter);

// admin/category
router.use("/category", userVerification, categoryRouter);

// // admin/contentType
// router.use("/contentType", userVerification, contentTypeRouter);

// // admin/permission
// router.use("/permission", userVerification, permissionRouter);

// admin/admin
router.use("/admin", userVerification, adminRouter);

export default router;
