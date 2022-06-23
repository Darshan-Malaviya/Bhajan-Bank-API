import express from "express";
import {
	categoryCreateGetController,
	categoryCreatePostController,
	categoryDeleteController,
	categorysController,
	categoryStatusController,
	categoryUpdateGetController,
	categoryUpdatePostController,
} from "../controllers/category.controller.js";
import {
	categoryValidationMiddleware,
	idValidationMiddleware,
	idValidationMiddlewareForApi,
} from "../middlewares/validator.middleware.js";

const router = express.Router();

router.get("/", categorysController);

router.delete(
	"/delete/:id",
	idValidationMiddlewareForApi,
	categoryDeleteController
);

router.get("/create", categoryCreateGetController);
router.get("/update/:id", idValidationMiddleware, categoryUpdateGetController);

router.post(
	"/create",
	categoryValidationMiddleware,
	categoryCreatePostController
);
router.post(
	"/update/:id",
	idValidationMiddlewareForApi,
	categoryValidationMiddleware,
	categoryUpdatePostController
);
router.post(
	"/update-status/:id",
	idValidationMiddlewareForApi,
	categoryStatusController
);

export default router;
