import express from "express";
import {
	contentTypeCreateGetController,
	contentTypeCreatePostController,
	contentTypeDeleteController,
	contentTypesController,
	contentTypeStatusController,
	contentTypeUpdateGetController,
	contentTypeUpdatePostController,
} from "../controllers/contentType.controller.js";
import {
	contentTypeValidationMiddleware,
	idValidationMiddleware,
	idValidationMiddlewareForApi,
} from "../middlewares/validator.middleware.js";

const router = express.Router();

router.get("/", contentTypesController);

router.delete(
	"/delete/:id",
	idValidationMiddlewareForApi,
	contentTypeDeleteController
);

router.get("/create", contentTypeCreateGetController);

router.get(
	"/update/:id",
	idValidationMiddleware,
	contentTypeUpdateGetController
);

router.post(
	"/create",
	contentTypeValidationMiddleware,
	contentTypeCreatePostController
);
router.post(
	"/update/:id",
	idValidationMiddlewareForApi,
	contentTypeValidationMiddleware,
	contentTypeUpdatePostController
);

router.post(
	"/update-status/:id",
	idValidationMiddlewareForApi,
	contentTypeStatusController
);

export default router;
