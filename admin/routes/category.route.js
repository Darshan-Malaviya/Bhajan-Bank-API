import express from 'express';
import {
    categoryCreateGetController,
    categoryCreatePostController,
    categoryDeleteController,
    categorysController,
    categoryStatusController,
    categoryUpdateGetController,
    categoryUpdatePostController,
    categoryViewController,
} from '../controllers/category.controller.js';
import { idValidationMiddleware, idValidationMiddlewareForApi } from '../middlewares/idValidator.middleware.js';

const router = express.Router();


router.get('/', categorysController);

router.get("/delete/:id", idValidationMiddleware, categoryDeleteController);

router.get("/create", categoryCreateGetController);
router.get("/view/:id", idValidationMiddleware, categoryViewController);
router.get("/update/:id", idValidationMiddleware, categoryUpdateGetController);

router.post("/create", categoryCreatePostController);
router.post("/update/:id", idValidationMiddleware, categoryUpdatePostController);
router.post("/update-status/:id", idValidationMiddlewareForApi, categoryStatusController);

export default router;