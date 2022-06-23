import express from "express";
import {
	adminCreateGetController,
	adminCreatePostController,
	adminDeleteController,
	adminsController,
	adminUpdateGetController,
	adminUpdatePostController,
	adminUsersPermissionPostController,
	adminStatusController,
	adminSuperUserStatusController,
	adminResetPasswordController,
} from "../controllers/admin.controller.js";
import {
	adminUserValidationMiddleware,
	idValidationMiddleware,
	idValidationMiddlewareForApi,
	resetPasswordValidationMiddleware,
} from "../middlewares/validator.middleware.js";

const router = express.Router();

router.get("/", adminsController);

router.delete(
	"/delete/:id",
	idValidationMiddlewareForApi,
	adminDeleteController
);

router.get("/create", adminCreateGetController);

router.get("/update/:id", idValidationMiddleware, adminUpdateGetController);

router.post(
	"/create",
	adminUserValidationMiddleware,
	adminCreatePostController
);
router.post(
	"/update/:id",
	idValidationMiddlewareForApi,
	adminUserValidationMiddleware,
	adminUpdatePostController
);
router.post(
	"/update-status/:id",
	idValidationMiddlewareForApi,
	adminStatusController
);

router.post(
	"/update-superuser/:id",
	idValidationMiddlewareForApi,
	adminSuperUserStatusController
);

router.post(
	"/user-permissions/:id",
	idValidationMiddlewareForApi,
	adminUsersPermissionPostController
);

router.post(
	"/reset-password/:id",
	idValidationMiddlewareForApi,
	resetPasswordValidationMiddleware,
	adminResetPasswordController
);

export default router;
