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

const router = express.Router();


router.get('/', permissionsController);

router.get("/delete/:id", permissionDeleteController);

router.get("/create", permissionCreateGetController);
router.get("/view/:id", permissionViewController);
router.get("/update/:id", permissionUpdateGetController);

router.post("/create", permissionCreatePostController);
router.post("/update/:id", permissionUpdatePostController);

export default router;