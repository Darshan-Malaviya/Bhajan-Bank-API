import express from "express";
import {
	mediaController,
	mediaCreateGetController,
	mediaCreatePostController,
	mediaDeleteController,
	mediaStatusController,
} from "../controllers/media.controller.js";
import { fileUpload } from "../helpers/multerStorage.js";
import {
	idValidationMiddlewareForApi,
	mediaValidationMiddleware,
} from "../middlewares/validator.middleware.js";

const router = express.Router();

router.get("/", mediaController);

router.get("/create", mediaCreateGetController);

router.post(
	"/create",
	fileUpload.single("mediaFile"),
	mediaValidationMiddleware,
	mediaCreatePostController
);

router.delete(
	"/delete/:id",
	idValidationMiddlewareForApi,
	mediaDeleteController
);

router.post(
	"/update-status/:id",
	idValidationMiddlewareForApi,
	mediaStatusController
);

export default router;
