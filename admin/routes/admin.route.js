import express from 'express';
import {
    adminCreateGetController,
    adminCreatePostController,
    adminDeleteController,
    adminsController,
    adminUpdateGetController,
    adminUpdatePostController,
    adminViewController,
} from '../controllers/admin.controller.js';

const router = express.Router();


router.get('/', adminsController);

router.get("/delete/:id", adminDeleteController);

router.get("/create", adminCreateGetController);
router.get("/view/:id", adminViewController);
router.get("/update/:id", adminUpdateGetController);

router.post("/create", adminCreatePostController);
router.post("/update/:id", adminUpdatePostController);

export default router;