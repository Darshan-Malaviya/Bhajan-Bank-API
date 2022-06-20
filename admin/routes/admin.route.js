import express from 'express';
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
} from '../controllers/admin.controller.js';
import { idValidationMiddleware } from '../middlewares/idValidator.middleware.js';

const router = express.Router();


router.get('/', adminsController);

router.get("/delete/:id", idValidationMiddleware, adminDeleteController);

router.get("/create", adminCreateGetController);
router.get("/view/:id", idValidationMiddleware, adminViewController);
router.get("/update/:id", idValidationMiddleware, adminUpdateGetController);

router.post("/create", adminCreatePostController);
router.post("/update/:id", idValidationMiddleware, adminUpdatePostController);

router.get("/usersPermission/:id", idValidationMiddleware, adminUsersPermissionGetController);
router.post("/usersPermission/:id", idValidationMiddleware, adminUsersPermissionPostController);

export default router;