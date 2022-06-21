import express from "express";
import {
	adminCreateGetController,
	adminCreatePostController,
	adminDeleteController,
	adminsController,
	adminUpdateGetController,
	adminUpdatePostController,
	adminUsersPermissionGetController,
	adminUsersPermissionPostController,
	adminViewController,
	adminStatusController,
	adminSuperUserStatusController,
} from "../controllers/admin.controller.js";
import {
	adminUserValidationMiddleware,
	idValidationMiddleware,
	idValidationMiddlewareForApi,
} from "../middlewares/validator.middleware.js";

const router = express.Router();

router.get("/", adminsController);

router.delete(
	"/delete/:id",
	idValidationMiddlewareForApi,
	adminDeleteController
);

router.get("/create", adminCreateGetController);
router.get("/view/:id", idValidationMiddleware, adminViewController);
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

// router.get(
// 	"/usersPermission/:id",
// 	idValidationMiddleware,
// 	adminUsersPermissionGetController
// );
// router.post(
// 	"/usersPermission/:id",
// 	idValidationMiddleware,
// 	adminUsersPermissionPostController
// );

export default router;
