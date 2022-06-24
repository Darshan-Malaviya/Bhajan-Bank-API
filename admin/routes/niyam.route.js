import express from "express";
import {
	niyamController,
	niyamCreateGetController,
	niyamCreatePostController,
	niyamDeleteController,
	niyamStatusController,
	niyamUpdateGetController,
	niyamUpdatePostController,
} from "../controllers/niyam.controller.js";
import {
	idValidationMiddleware,
	idValidationMiddlewareForApi,
} from "../middlewares/validator.middleware.js";

const router = express.Router();

router.get("/", niyamController);

router.get("/create", niyamCreateGetController);

router.post("/create", niyamCreatePostController);

router.get("/update/:id", idValidationMiddleware, niyamUpdateGetController);

router.post(
	"/update/:id",
	idValidationMiddlewareForApi,
	niyamUpdatePostController
);

router.delete(
	"/delete/:id",
	idValidationMiddlewareForApi,
	niyamDeleteController
);

router.post(
	"/update-status/:id",
	idValidationMiddlewareForApi,
	niyamStatusController
);

export default router;
