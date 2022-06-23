import express from "express";
import {
	permissionCreateGetController,
	permissionCreatePostController,
	permissionDeleteController,
	permissionsController,
	permissionStatusController,
	permissionUpdateGetController,
	permissionUpdatePostController,
} from "../controllers/permission.controller.js";
import {
	idValidationMiddleware,
	idValidationMiddlewareForApi,
	permissionValidationMiddleware,
} from "../middlewares/validator.middleware.js";

const router = express.Router();

router.get("/", permissionsController);

router.delete(
	"/delete/:id",
	idValidationMiddlewareForApi,
	permissionDeleteController
);

router.get("/create", permissionCreateGetController);

router.get(
	"/update/:id",
	idValidationMiddleware,
	permissionUpdateGetController
);

router.post(
	"/create",
	permissionValidationMiddleware,
	permissionCreatePostController
);

router.post(
	"/update/:id",
	idValidationMiddlewareForApi,
	permissionValidationMiddleware,
	permissionUpdatePostController
);

router.post(
	"/update-status/:id",
	idValidationMiddlewareForApi,
	permissionStatusController
);

export default router;
