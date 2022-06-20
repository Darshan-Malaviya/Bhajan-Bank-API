import express from 'express';
import {
    permissionCreateGetController,
    permissionCreatePostController,
    permissionDeleteController,
    permissionsController,
    permissionUpdateGetController,
    permissionUpdatePostController,
    permissionViewController,
} from '../controllers/permission.controller.js';
import { idValidationMiddleware } from '../middlewares/idValidator.middleware.js';

const router = express.Router();


router.get('/', permissionsController);

router.get("/delete/:id", idValidationMiddleware, permissionDeleteController);

router.get("/create", permissionCreateGetController);
router.get("/view/:id", idValidationMiddleware, permissionViewController);
router.get("/update/:id", idValidationMiddleware, permissionUpdateGetController);

router.post("/create", permissionCreatePostController);
router.post("/update/:id", idValidationMiddleware, permissionUpdatePostController);

export default router;